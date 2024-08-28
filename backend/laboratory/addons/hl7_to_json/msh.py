class MSH:
  def __init__(self):
     pass
  
  def parse(self, json_data):
    msh_map = {
          "MSH.1": "Field Separator",
          "MSH.2": "Encoding Characters",
          "MSH.3": "Sending Application",
          "MSH.4": "Sending Facility",
          "MSH.5": "Receiving Application",
          "MSH.6": "Receiving Facility",
          "MSH.7": "Date / Time of Message",
          "MSH.8": "Security",
          "MSH.9": "Message Type",
          "MSH.10": "Message Control ID",
          "MSH.11": "Processing ID",
          "MSH.12": "Version ID",
          "MSH.13": "Sequence Number",
          "MSH.14": "Continuation Pointer",
          "MSH.15": "Accept Acknowledgement Type",
          "MSH.16": "Application Acknowledgement Type",
          "MSH.17": "Country Code",
          "MSH.18": "Character Set",
          "MSH.19": "Principal Language of Message"
      }
    msh_value = json_data.get("MSH")
    msh_data = {}
    if msh_value:
          for key in msh_map:
              if key in msh_value:
                  msh_data[key] = { "name":msh_map[key],"value": msh_value[key]}
    return msh_data
  

  