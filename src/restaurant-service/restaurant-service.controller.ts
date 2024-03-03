import {
  Controller,
  Get,
  Body,
  Res,
  Post,
  Put,
  Delete,
  UsePipes,
  Param,
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
  public createRestaurantListing(
    @Body() payload: restaurantSchema,
    @Res() res,
  ) {
    try {
      const createListingAPIResponse =
        this.restaurantService.createRestaurantListing(payload);
      return this.utils.handleSuccessResponse(res, createListingAPIResponse);
    } catch (err) {
      return this.utils.handleFailureResponse(res, err);
    }
  }

  @Put('listing/modify')
  @UsePipes(new RestaurantServicePipe(listingModifyAPISchema))
  public modifyRestaurantListing(
    @Body() payload: restaurantSchema,
    @Res() res,
  ) {
    try {
      const modifyListingAPIResponse =
        this.restaurantService.modifyRestaurantListing(payload);
      return this.utils.handleSuccessResponse(res, modifyListingAPIResponse);
    } catch (err) {
      return this.utils.handleFailureResponse(res, err);
    }
  }

  @Delete('listing/remove')
  public deleteRestaurantListing(
    @Param('listingName') listingName: string,
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
    @Param('listingName') listingName: string,
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
  public createRestaurantReview(@Body() payload: reviewSchema, @Res() res) {
    try {
      const createReviewAPIResponse =
        this.restaurantService.createRestaurantReview(payload);
      return this.utils.handleSuccessResponse(res, createReviewAPIResponse);
    } catch (err) {
      return this.utils.handleFailureResponse(res, err);
    }
  }

  @Put('review/edit')
  @UsePipes(new RestaurantServicePipe(reviewUpdateAPISchema))
  public modifyRestaurantReview(
    @Body() payload: editReviewAPISchema,
    @Res() res,
  ) {
    try {
      const modifyReviewAPIResponse =
        this.restaurantService.modifyRestaurantReview(payload);
      return this.utils.handleSuccessResponse(res, modifyReviewAPIResponse);
    } catch (err) {
      return this.utils.handleFailureResponse(res, err);
    }
  }

  @Delete('review/delete')
  public deleteRestaurantReview(
    @Param('reviewId') reviewId: string,
    @Param('listingName') listingName: string,
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
