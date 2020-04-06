import moment from "moment";
/**
 * Checks if the given string is an valid date format conform to xsd:date.
 * Expected date format ex: 01-01-2020
 */
export default function constraintValidDate(value/*, options*/) {
  if(value.datatype.value !== "http://www.w3.org/2001/XMLSchema#date"){
    return false;
  }

  let dateString = value.value;

  if (moment(dateString, "YYYY-MM-DD", true).isValid()){
    return true;
  }
  else {
    return false;
  }
}
