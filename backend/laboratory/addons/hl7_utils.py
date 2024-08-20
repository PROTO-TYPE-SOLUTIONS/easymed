import json
from msh import MSH
from pid import PID


class HL7Utils:
  def __init__(self):
     pass

  def parse(self, hl7_message):
        """Converts an HL7 message to a JSON object.
        """
        segments = hl7_message.split('\r')
        json_message = {}
        for segment in segments:
          fields = segment.split('|')
          segment_type = fields[0]
          json_segment = {}
          for i, field in enumerate(fields):
            if i == 0:
              continue
            index = i
            if segment_type == 'MSH': 
                index = index +1
            field_name = segment_type + '.' + str(index)
            if field != ' ' and field != '':
              if field_name == 'MSH.2':
                 json_segment["MSH.1"] = "|"
                 json_segment[field_name.strip()] = field
                 continue
              json_segment[field_name.strip()] = field
              subsegment_values = field.split('^')
              if len(subsegment_values) >1:
                for j, subfieldValue in enumerate(subsegment_values):
                  field_name = segment_type + '.'+ str(index) +  '.' + str(j+1)
                  if subfieldValue != ' ' and subfieldValue != '':
                    json_segment[field_name.strip()] = subfieldValue
                    sub_subsegment_values = subfieldValue.split('~')
                    if len(sub_subsegment_values) >1:
                      for k, second_subfieldValue in enumerate(sub_subsegment_values):
                        field_name = segment_type + '.'+ str(index) +  '.' + str(j+1)+  '.' + str(k+1)
                        if second_subfieldValue != ' ' and second_subfieldValue != '':
                          json_segment[field_name.strip()] = second_subfieldValue


          json_message[segment_type.strip()] = json_segment

        return json_message
  



  def detailed(self, json_data):
      msh_data = MSH().parse(json_data)
      pid_data = PID().parse(json_data)
      return {"MSH":msh_data,"PID":pid_data}



