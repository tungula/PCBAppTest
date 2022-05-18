export interface requestPropsModel {
   onSuccess?: (args: any) => void;
   onFailure?: (args: any) => void;
   callback?: () => void;
   countrySearch?: string;
   //to support the rest operator
   [x: string]: any;
}
