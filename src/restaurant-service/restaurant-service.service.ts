import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { UtilityService } from 'src/utility/utility.service';
import {
  ImageOperations,
  RestaurantErrorResponse,
  restaurantSchema,
  ReplyReviewSchema,
  reviewSchema,
  editReviewAPISchema,
} from './restaurant-service.interface';
import { CommonErrorMessages } from 'src/utility/utility.interface';
import { v4 as uuidv4 } from 'uuid';
import { Roles } from 'src/login-service/login-service.interface';

@Injectable()
export class RestaurantServiceService {
  constructor(private utils: UtilityService) {}

  private validateListingDetails(
    existingListingData: restaurantSchema,
    newListingData: restaurantSchema,
    bypassNameCheck: boolean = false,
  ): boolean {
    if (
      (!bypassNameCheck &&
        existingListingData.listingName == newListingData.listingName) ||
      existingListingData.listingName == newListingData?.updatedListingName
    ) {
      throw new Error(RestaurantErrorResponse.L2);
    } else if (
      existingListingData.contactAddress == newListingData?.contactAddress
    ) {
      throw new Error(RestaurantErrorResponse.L3);
    } else if (existingListingData.contactNo == newListingData?.contactNo) {
      throw new Error(RestaurantErrorResponse.L4);
    }
    return true;
  }

  private generateID(): string {
    return uuidv4();
  }

  public fetchAllActiveRestaurants() {
    const filePath = join(process.cwd(), '/src/sample-db/restaurants.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    if (!fileData) {
      throw new Error(RestaurantErrorResponse.L1);
    }

    const parsedDataFromFile: Record<string, restaurantSchema> =
      this.utils.getParsedData(fileData);

    return {
      statusCode: 200,
      statusMessage: 'Restaurant Listing Fetched Successfully!',
      data: {
        restaurants: Object.values(parsedDataFromFile).filter(
          (restaurantData: restaurantSchema) => {
            return restaurantData.isActive;
          },
        ),
      },
    };
  }

  public createRestaurantListing(
    payload: restaurantSchema,
    files: Express.Multer.File[],
    userEmail: string,
    userRole: Roles,
  ) {
    const { listingName, contactNo, contactAddress } = payload;
    const filePath = join(process.cwd(), '/src/sample-db/restaurants.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    let parsedDataFromFile: Record<string, restaurantSchema> = {};
    if (fileData.length) {
      parsedDataFromFile = this.utils.getParsedData(fileData);
      for (const listingDetails of Object.values(parsedDataFromFile)) {
        this.validateListingDetails(listingDetails, payload);
      }
    }

    parsedDataFromFile[listingName] = {
      listingName,
      contactNo,
      contactAddress,
      images: files?.map((file) => {
        const base64String = file.buffer.toString('base64');
        return base64String;
      }) || [''],
      isActive: true,
      createdBy: userEmail,
      userRole,
    };

    const stringifiedFileData: string = JSON.stringify(parsedDataFromFile);

    try {
      fs.writeFileSync(filePath, stringifiedFileData, 'utf-8');
      return {
        statusCode: 200,
        statusMessage: 'Restaurant Listed Successfully!',
        data: { ...payload },
      };
    } catch (err) {
      console.error('Error while inserting new listing: ', err.message);
      throw new Error(CommonErrorMessages.SE1);
    }
  }

  public modifyRestaurantListing(
    payload: restaurantSchema,
    files: Express.Multer.File[],
    userEmail: string,
    userRole: Roles,
  ) {
    const filePath = join(process.cwd(), '/src/sample-db/restaurants.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    if (!fileData.length) throw new Error(RestaurantErrorResponse.L5);

    const parsedDataFromFile: Record<string, restaurantSchema> =
      this.utils.getParsedData(fileData);

    const existingData = parsedDataFromFile[payload.listingName];
    if (!existingData) throw new Error(RestaurantErrorResponse.L5);

    if (!existingData.isActive && !('isActive' in payload))
      throw new Error(RestaurantErrorResponse.L7);

    this.validateListingDetails(existingData, payload, true);

    const dataToBeUpdated = {
      listingName: payload.updatedListingName || existingData.listingName,
      contactNo: payload.contactNo || existingData.contactNo,
      contactAddress: payload.contactAddress || existingData.contactAddress,
      images: existingData.images,
      isActive: existingData.isActive,
      updatedBy: userEmail,
      userRole,
    };

    parsedDataFromFile[dataToBeUpdated.listingName] = dataToBeUpdated;

    if (!existingData.isActive && payload.isActive == 'true')
      dataToBeUpdated.isActive = true;

    if (payload.imageType == ImageOperations.insert) {
      if (!files?.length) throw new Error(RestaurantErrorResponse.L6);
      if (!parsedDataFromFile[dataToBeUpdated.listingName].images?.length) {
        parsedDataFromFile[dataToBeUpdated.listingName].images = files.map(
          (file) => {
            const base64String = file.buffer.toString('base64');
            return base64String;
          },
        );
      } else {
        parsedDataFromFile[dataToBeUpdated.listingName].images.push(
          ...files.map((file) => {
            const base64String = file.buffer.toString('base64');
            return base64String;
          }),
        );
      }
    } else if (payload.imageType == ImageOperations.remove) {
      parsedDataFromFile[dataToBeUpdated.listingName].images = [''];
    }

    if (payload.updatedListingName)
      delete parsedDataFromFile[payload.listingName];

    const stringifiedFileData: string = JSON.stringify(parsedDataFromFile);

    try {
      fs.writeFileSync(filePath, stringifiedFileData, 'utf-8');
      return {
        statusCode: 200,
        statusMessage: 'Restaurant Listing Updated Successfully!',
        data: { ...payload },
      };
    } catch (err) {
      console.error('Error while updating existing listing: ', err.message);
      throw new Error(CommonErrorMessages.SE1);
    }
  }

  public deleteRestaurantListing(listingName: string) {
    const filePath = join(process.cwd(), '/src/sample-db/restaurants.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    if (!fileData.length) throw new Error(RestaurantErrorResponse.L5);

    const parsedDataFromFile: Record<string, restaurantSchema> =
      this.utils.getParsedData(fileData);
    const existingData = parsedDataFromFile[listingName];
    if (!existingData) throw new Error(RestaurantErrorResponse.L5);

    if (!existingData.isActive) throw new Error(RestaurantErrorResponse.L7);

    parsedDataFromFile[listingName].isActive = false;

    const stringifiedFileData: string = JSON.stringify(parsedDataFromFile);

    try {
      fs.writeFileSync(filePath, stringifiedFileData, 'utf-8');
      return {
        statusCode: 200,
        statusMessage: 'Restaurant Listing Deleted Successfully!',
        data: {},
      };
    } catch (err) {
      console.error('Error while deleting existing listing: ', err.message);
      throw new Error(CommonErrorMessages.SE1);
    }
  }

  public fetchRestaurantReviews(listingName: string) {
    const listingFilePath = join(
      process.cwd(),
      '/src/sample-db/restaurants.json',
    );
    const listingFileData = fs.readFileSync(listingFilePath, 'utf-8');
    if (!listingFileData) throw new Error(RestaurantErrorResponse.L5);

    const parsedListingDataFromFile: Record<string, restaurantSchema> =
      this.utils.getParsedData(listingFileData);

    if (!parsedListingDataFromFile[listingName])
      throw new Error(RestaurantErrorResponse.R2);

    const reviewsFilePath = join(process.cwd(), '/src/sample-db/reviews.json');
    const reviewsFileData = fs.readFileSync(reviewsFilePath, 'utf-8');
    if (!reviewsFileData) throw new Error(RestaurantErrorResponse.R1);

    const parsedReviewsDataFromFile: Record<string, ReplyReviewSchema> =
      this.utils.getParsedData(reviewsFileData);

    if (!parsedReviewsDataFromFile[listingName])
      throw new Error(RestaurantErrorResponse.R1);

    return {
      statusCode: 200,
      statusMessage: 'Restaurant Review Fetched Successfully!',
      data: {
        reviews: Object.values(parsedReviewsDataFromFile),
      },
    };
  }

  public createRestaurantReview(
    payload: reviewSchema,
    userEmail: string,
    userRole: Roles,
  ) {
    const listingFilePath = join(
      process.cwd(),
      '/src/sample-db/restaurants.json',
    );
    const listingFileData = fs.readFileSync(listingFilePath, 'utf-8');
    if (!listingFileData) throw new Error(RestaurantErrorResponse.L5);

    const parsedListingDataFromFile: Record<string, restaurantSchema> =
      this.utils.getParsedData(listingFileData);

    if (
      !parsedListingDataFromFile[payload.listingName] ||
      !parsedListingDataFromFile[payload.listingName].isActive
    )
      throw new Error(RestaurantErrorResponse.R2);

    const reviewsFilePath = join(process.cwd(), '/src/sample-db/reviews.json');
    const reviewsFileData = fs.readFileSync(reviewsFilePath, 'utf-8');

    let parsedReviewsDataFromFile: Record<
      string,
      Record<string, ReplyReviewSchema>
    > = {};

    const generatedReviewId = this.generateID();

    if (reviewsFileData) {
      parsedReviewsDataFromFile = this.utils.getParsedData(reviewsFileData);
    }

    const reviewToBeAdded: ReplyReviewSchema = {
      reviewId: generatedReviewId,
      review: payload.review,
      userEmail: userEmail,
      userRole: userRole,
      replies: {},
    };

    if (
      Object.keys(parsedReviewsDataFromFile[payload.listingName] || {}).length
    ) {
      parsedReviewsDataFromFile[payload.listingName][generatedReviewId] =
        reviewToBeAdded;
    } else {
      parsedReviewsDataFromFile[payload.listingName] = {
        [generatedReviewId]: reviewToBeAdded,
      };
    }

    const stringifiedFileData: string = JSON.stringify(
      parsedReviewsDataFromFile,
    );

    try {
      fs.writeFileSync(reviewsFilePath, stringifiedFileData, 'utf-8');
      return {
        statusCode: 200,
        statusMessage: 'Restaurant Review Addedd Successfully!',
        data: {},
      };
    } catch (err) {
      console.error('Error while adding restaurant review: ', err.message);
      throw new Error(CommonErrorMessages.SE1);
    }
  }

  public modifyRestaurantReview(
    payload: editReviewAPISchema,
    userEmail: string,
    userRole: Roles,
  ) {
    const listingFilePath = join(
      process.cwd(),
      '/src/sample-db/restaurants.json',
    );
    const listingFileData = fs.readFileSync(listingFilePath, 'utf-8');
    if (!listingFileData) throw new Error(RestaurantErrorResponse.L5);

    const parsedListingDataFromFile: Record<string, restaurantSchema> =
      this.utils.getParsedData(listingFileData);

    if (
      !parsedListingDataFromFile[payload.listingName] ||
      !parsedListingDataFromFile[payload.listingName].isActive
    )
      throw new Error(RestaurantErrorResponse.R2);

    const reviewsFilePath = join(process.cwd(), '/src/sample-db/reviews.json');
    const reviewsFileData = fs.readFileSync(reviewsFilePath, 'utf-8');
    if (!reviewsFileData) throw new Error(RestaurantErrorResponse.R1);

    const parsedReviewsDataFromFile: Record<string, ReplyReviewSchema> =
      this.utils.getParsedData(reviewsFileData);

    if (!parsedReviewsDataFromFile[payload.listingName])
      throw new Error(RestaurantErrorResponse.R1);

    if (!parsedReviewsDataFromFile[payload.listingName][payload.reviewId])
      throw new Error(RestaurantErrorResponse.R3);

    if (userRole == Roles.bo) {
      const replyReviewId: string = this.generateID();
      parsedReviewsDataFromFile[payload.listingName][payload.reviewId].replies[
        replyReviewId
      ] = {
        replyReview: payload.replyReview,
        userEmail: userEmail,
      };
    } else {
      const existingData =
        parsedReviewsDataFromFile[payload.listingName][payload.reviewId];
      parsedReviewsDataFromFile[payload.listingName][payload.reviewId] = {
        review: payload.review,
        userEmail: userEmail,
        userRole: userRole,
        reviewId: existingData.reviewId,
        replies: existingData.replies,
      };
    }

    const stringifiedFileData: string = JSON.stringify(
      parsedReviewsDataFromFile,
    );

    try {
      fs.writeFileSync(reviewsFilePath, stringifiedFileData, 'utf-8');
      return {
        statusCode: 200,
        statusMessage: 'Restaurant Review Updated Successfully!',
        data: {},
      };
    } catch (err) {
      console.error('Error while updating restaurant review: ', err.message);
      throw new Error(CommonErrorMessages.SE1);
    }
  }

  public deleteRestaurantReview(reviewId: string, listingName: string) {
    const listingFilePath = join(
      process.cwd(),
      '/src/sample-db/restaurants.json',
    );
    const listingFileData = fs.readFileSync(listingFilePath, 'utf-8');
    if (!listingFileData) throw new Error(RestaurantErrorResponse.L5);

    const parsedListingDataFromFile: Record<string, restaurantSchema> =
      this.utils.getParsedData(listingFileData);

    if (
      !parsedListingDataFromFile[listingName] ||
      !parsedListingDataFromFile[listingName].isActive
    )
      throw new Error(RestaurantErrorResponse.R2);

    const reviewsFilePath = join(process.cwd(), '/src/sample-db/reviews.json');
    const reviewsFileData = fs.readFileSync(reviewsFilePath, 'utf-8');
    if (!reviewsFileData) throw new Error(RestaurantErrorResponse.R1);

    const parsedReviewsDataFromFile: Record<string, ReplyReviewSchema> =
      this.utils.getParsedData(reviewsFileData);

    if (!parsedReviewsDataFromFile[listingName])
      throw new Error(RestaurantErrorResponse.R1);

    if (!parsedReviewsDataFromFile[listingName][reviewId])
      throw new Error(RestaurantErrorResponse.R3);

    delete parsedReviewsDataFromFile[listingName][reviewId];

    const stringifiedFileData: string = JSON.stringify(
      parsedReviewsDataFromFile,
    );

    try {
      fs.writeFileSync(reviewsFilePath, stringifiedFileData, 'utf-8');
      return {
        statusCode: 200,
        statusMessage: 'Restaurant Review Deleted Successfully!',
        data: {},
      };
    } catch (err) {
      console.error('Error while deleting restaurant review: ', err.message);
      throw new Error(CommonErrorMessages.SE1);
    }
  }
}
