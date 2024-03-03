import Joi from 'joi';
import { Roles } from 'src/login-service/login-service.interface';

export interface restaurantSchema {
  listingName: string;
  contactNo?: string;
  contactAddress?: string;
  images?: string[];
  isActive?: boolean;
  updatedListingName?: string;
  imageType?: ImageOperations;
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
  userEmail: string;
  userRole: Roles;
}

export interface ReplyReviewSchema extends AddReviewSchema {
  replies: Record<string, ReplySchema>;
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
  contactNo: Joi.string().pattern(new RegExp('/^+91[6-9]d{9}$/')).required(),
  contactAddress: Joi.string().min(20).max(120).required(),
  images: Joi.array().min(1).required(),
}).unknown(false);

export const listingModifyAPISchema = Joi.object({
  listingName: Joi.string().required(),
  updatedListingName: Joi.string().min(5).optional(),
  contactNo: Joi.string().pattern(new RegExp('/^+91[6-9]d{9}$/')).optional(),
  contactAddress: Joi.string().min(20).max(120).optional(),
  images: Joi.array().optional(),
  isActive: Joi.boolean().optional(),
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
  review: Joi.string().min(15).max(150).required(),
  reviewId: Joi.string().required(),
  replyReview: Joi.string().min(15).max(150).optional(),
  replyReviewId: Joi.string().optional(),
}).unknown(false);
