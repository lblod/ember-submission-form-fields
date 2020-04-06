import moment from "moment";
/**
 * Checks if the given string is an valid date-time format conform to xsd:datetime.
 * Expected datetime format ex: 01-01-2020T01:01:01Z
 */
export default function constraintValidDateTime(value) {
  if(value.datatype.value !== "http://www.w3.org/2001/XMLSchema#dateTime"){
    return false;
 }
  return validDateTimeString(value.value);
}

function validDateTimeString(value) {
  if (moment(value, "YYYY-MM-DDTHH:mm:ss.SSSSZ", true).isValid()){
    return true;
  }
  else {
    return false;
  }
}
