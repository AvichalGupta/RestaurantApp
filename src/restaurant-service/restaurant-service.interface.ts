import * as Joi from 'joi';
import { Roles } from 'src/login-service/login-service.interface';

export interface restaurantSchema {
  listingName: string;
  contactNo?: string;
  contactAddress?: string;
  images?: string[];
  isActive?: boolean | string;
  updatedListingName?: string;
  imageType?: ImageOperations;
  createdBy?: string;
  userRole?: Roles;
}

export interface reviewSchema extends AddReviewSchema {
  listingName: string;
}

export interface editReviewAPISchema extends AddReviewSchema {
  listingName: string;
  replyReview: string;
  replyReviewId: string;
}

export interface AddReviewSchema {
  review: string;
  reviewId: string;
}

export interface ReplyReviewSchema extends AddReviewSchema {
  replies: Record<string, ReplySchema>;
  userEmail?: string;
  userRole?: Roles;
}

export interface ReplySchema {
  replyReview: string;
  userEmail: string;
}

export enum RestaurantErrorResponse {
  L1 = 'No Active Restaurants',
  L2 = 'Listing with given name already existing.',
  L3 = 'Listing already exists on mentioned address, please provide a more accurate address.',
  L4 = 'Contact number already in use, please provide an alternate number.',
  L5 = 'Please create listing first!',
  L6 = 'Please provide images to be inserted.',
  L7 = 'Restaurant Listing being modified does not exist.',
  R1 = 'No Reviews found for restaurant.',
  R2 = 'No listing found for given listing name. Please enter a valid listing name',
  R3 = 'Review for mentioned id does not exist.',
}

export enum ImageOperations {
  remove = 'remove',
  insert = 'insert',
}

export const listingInsertAPISchema = Joi.object({
  listingName: Joi.string().min(5).required(),
  contactNo: Joi.string().min(10).required(),
  contactAddress: Joi.string().min(20).max(120).required(),
}).unknown(false);

export const listingModifyAPISchema = Joi.object({
  listingName: Joi.string().required(),
  updatedListingName: Joi.string().min(5).optional(),
  contactNo: Joi.string().min(10).optional(),
  contactAddress: Joi.string().min(20).max(120).optional(),
  isActive: Joi.string().valid('true', 'false').optional(),
  imageType: Joi.string()
    .valid(...Object.values(ImageOperations))
    .optional(),
}).unknown(false);

export const reviewInsertAPISchema = Joi.object({
  listingName: Joi.string().min(5).required(),
  review: Joi.string().min(15).max(150).required(),
}).unknown(false);

export const reviewUpdateAPISchema = Joi.object({
  listingName: Joi.string().min(5).required(),
  review: Joi.string().min(15).max(150).optional(),
  reviewId: Joi.string().optional(),
  replyReview: Joi.string().min(15).max(150).optional(),
  replyReviewId: Joi.string().optional(),
}).unknown(false);
