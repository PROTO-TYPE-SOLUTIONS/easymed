class PID:
  def __init__(self):
     pass
  
  def parse(self, json_data):
      pid_map= {
        "PID.1": "Set ID - Patient ID",
        "PID.2": "Patient ID (External ID)",
        "PID.3": "Patient ID (Internal ID)",
        "PID.4": "Alternate Patient ID",
        "PID.5": "Patient Name",
        "PID.5.1":"Family Name",
        "PID.5.2":"Given Name",
        "PID.5.3":"Middle Initial Or Name",
        "PID.5.4":"Suffix",
        "PID.5.5":"Prefix",
        "PID.5.6":"Degree",
        "PID.5.7":"Name Type Code",
        "PID.5.8":"Name Representation Code",
        "PID.6": "Mother's Maiden Name",
        "PID.7": "Date of Birth",
        "PID.8": "Sex",
        "PID.9": "Patient Alias",
        "PID.10": "Race",
        "PID.11": "Patient Address",
        "PID.11.1": "Street Address",
        "PID.11.2": " Other Designation",
        "PID.11.3": "City",
        "PID.11.4": "State Or Province",
        "PID.11.5": "Zip Or Postal Code",
        "PID.11.6": "Country",
        "PID.11.7": "Address Type",
        "PID.11.8": "Other Geographic Designation",
        "PID.11.9": "County/Parish Code",
        "PID.11.10": "Census Tract",
        "PID.11.11": "Address Representation Code",
        "PID.11.12": "Address Validity Range",
        "PID.11.13": "Effective Date",
        "PID.11.14": "Expiration Date",
        "PID.12": "County Code",
        "PID.13": "Phone Number - Home",
        "PID.14": "Phone Number - Business",
        "PID.15": "Primary Language",
        "PID.16": "Marital Status",
        "PID.17": "Religion",
        "PID.18": "Patient Account Number",
        "PID.19": "SSN Number - Patient",
        "PID.20": "Driver's License Number",
        "PID.21": "Mother's Identifier",
        "PID.22": "Ethnic Group",
        "PID.23": "Birth Place",
        "PID.24": "Multiple Birth Indicator",
        "PID.25": "Birth Order",
        "PID.26": "Citizenship",
        "PID.26.1": "Citizenship Identifier",
        "PID.26.2": "Citizenship Text",
        "PID.26.3": "Citizenship Name Of Coding System",
        "PID.26.4": "Citizenship Alternate Components",
        "PID.26.5": "Citizenship Alternate Text",
        "PID.26.6": "Citizenship  Name Of Alternate Coding System",
        "PID.27": "Veterans Military Status",
        "PID.28": "Nationality Code",
        "PID.29": "Patient Death Date and Time",
        "PID.30": "Patient Death Indicator"
      }

      pid_value = json_data.get("PID")
      pid_data = {}
      if pid_value:
        for key in pid_map:
            if key in pid_value:
               pid_data[key] = { "name":pid_map[key],"value": pid_value[key]}
      return pid_data