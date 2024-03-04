import {
  Controller,
  Get,
  Body,
  Res,
  Req,
  Post,
  Put,
  Delete,
  UsePipes,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { UtilityService } from 'src/utility/utility.service';
import { RestaurantServiceService } from './restaurant-service.service';
import { RestaurantServicePipe } from './restaurant-service.pipe';
import {
  editReviewAPISchema,
  listingInsertAPISchema,
  listingModifyAPISchema,
  restaurantSchema,
  reviewInsertAPISchema,
  reviewSchema,
  reviewUpdateAPISchema,
} from './restaurant-service.interface';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
@Controller({
  path: 'restaurants',
})
export class RestaurantServiceController {
  constructor(
    private utils: UtilityService,
    private restaurantService: RestaurantServiceService,
  ) {}

  @Get('listing/fetch')
  public fetchAllActiveRestaurants(@Res() res) {
    try {
      const fetchListingsAPIResponse =
        this.restaurantService.fetchAllActiveRestaurants();
      return this.utils.handleSuccessResponse(res, fetchListingsAPIResponse);
    } catch (err) {
      return this.utils.handleFailureResponse(res, err);
    }
  }

  @Post('listing/create')
  @UsePipes(new RestaurantServicePipe(listingInsertAPISchema))
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
  public createRestaurantListing(
    @UploadedFiles() files,
    @Body() payload: restaurantSchema,
    @Req() req,
    @Res() res,
  ) {
    try {
      const createListingAPIResponse =
        this.restaurantService.createRestaurantListing(
          payload,
          files.images,
          req.userEmail,
          req.userRole,
        );
      return this.utils.handleSuccessResponse(res, createListingAPIResponse);
    } catch (err) {
      return this.utils.handleFailureResponse(res, err);
    }
  }

  @Put('listing/modify')
  @UsePipes(new RestaurantServicePipe(listingModifyAPISchema))
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
  public modifyRestaurantListing(
    @UploadedFiles() files,
    @Body() payload: restaurantSchema,
    @Req() req,
    @Res() res,
  ) {
    try {
      const modifyListingAPIResponse =
        this.restaurantService.modifyRestaurantListing(
          payload,
          files.images,
          req.userEmail,
          req.userRole,
        );
      return this.utils.handleSuccessResponse(res, modifyListingAPIResponse);
    } catch (err) {
      return this.utils.handleFailureResponse(res, err);
    }
  }

  @Delete('listing/remove')
  public deleteRestaurantListing(
    @Query('listingName') listingName: string,
    @Res() res,
  ) {
    try {
      const deleteListingAPIResponse =
        this.restaurantService.deleteRestaurantListing(listingName);
      return this.utils.handleSuccessResponse(res, deleteListingAPIResponse);
    } catch (err) {
      return this.utils.handleFailureResponse(res, err);
    }
  }

  @Get('review/fetch')
  public fetchReviewsByListingName(
    @Query('listingName') listingName: string,
    @Res() res,
  ) {
    try {
      const fetchReviewsAPIResponse =
        this.restaurantService.fetchRestaurantReviews(listingName);
      return this.utils.handleSuccessResponse(res, fetchReviewsAPIResponse);
    } catch (err) {
      return this.utils.handleFailureResponse(res, err);
    }
  }

  @Post('review/add')
  @UsePipes(new RestaurantServicePipe(reviewInsertAPISchema))
  public createRestaurantReview(
    @Body() payload: reviewSchema,
    @Req() req,
    @Res() res,
  ) {
    try {
      const createReviewAPIResponse =
        this.restaurantService.createRestaurantReview(
          payload,
          req.userEmail,
          req.userRole,
        );
      return this.utils.handleSuccessResponse(res, createReviewAPIResponse);
    } catch (err) {
      console.log(err);
      return this.utils.handleFailureResponse(res, err);
    }
  }

  @Put('review/edit')
  @UsePipes(new RestaurantServicePipe(reviewUpdateAPISchema))
  public modifyRestaurantReview(
    @Body() payload: editReviewAPISchema,
    @Req() req,
    @Res() res,
  ) {
    try {
      const modifyReviewAPIResponse =
        this.restaurantService.modifyRestaurantReview(
          payload,
          req.userEmail,
          req.userRole,
        );
      return this.utils.handleSuccessResponse(res, modifyReviewAPIResponse);
    } catch (err) {
      return this.utils.handleFailureResponse(res, err);
    }
  }

  @Delete('review/delete')
  public deleteRestaurantReview(
    @Query('reviewId') reviewId: string,
    @Query('listingName') listingName: string,
    @Body() body,
    @Res() res,
  ) {
    try {
      const deleteReviewAPIResponse =
        this.restaurantService.deleteRestaurantReview(reviewId, listingName);
      return this.utils.handleSuccessResponse(res, deleteReviewAPIResponse);
    } catch (err) {
      return this.utils.handleFailureResponse(res, err);
    }
  }
}
