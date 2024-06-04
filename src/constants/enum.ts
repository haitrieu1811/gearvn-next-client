export enum TokenType {
  AccessToken,
  RefreshToken,
  VerifyEmailToken,
  ForgotPasswordToken
}

export enum RoleType {
  Create,
  Read,
  Update,
  Delete
}

export enum RoleField {
  Product,
  Post,
  Order,
  ProductCategory,
  PostCategory
}

export enum UserType {
  Admin,
  Staff,
  Customer
}

export enum Gender {
  Male,
  Female,
  Other
}

export enum UserStatus {
  Active,
  Inactive
}

export enum UserVerifyStatus {
  Verified,
  Unverified
}

export enum FileType {
  Image,
  Video
}

export enum AddressType {
  Home,
  Office,
  Other
}

export enum ProductCategoryStatus {
  Active,
  Inactive
}

export enum BrandStatus {
  Active,
  Inactive
}

export enum ProductStatus {
  Active,
  Inactive
}

export enum ProductApprovalStatus {
  Approved,
  Unapproved
}

export enum OrderStatus {
  InCart,
  WaitForConfirmation,
  Confirmed,
  Delivering,
  Delivered,
  Cancelled
}

export enum PaymentMethod {
  Cash,
  Banking
}

export enum PostStatus {
  Active,
  Inactive
}

export enum PostApprovalStatus {
  Approved,
  Unapproved
}
