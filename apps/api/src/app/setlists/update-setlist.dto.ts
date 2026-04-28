import { PartialType } from "@nestjs/mapped-types";
import { CreateSetlistDto } from "./create-setlist.dto";

export class UpdateSetlistDto extends PartialType(CreateSetlistDto) {
  // All fields from CreateSetlistDto will be added as optional
}