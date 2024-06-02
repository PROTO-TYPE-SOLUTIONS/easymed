Under ./addons you'll find usefull scripts to help troubleshoot communication/integration issues

# # Below are example data exchanges
# Mindray Equipment - HL7
## Patient sample
| Field               | Value                     |
|---------------------|---------------------------|
| Name of patient     | Mike                      |
| Gender              | Male                      |
| Birth date          | 01.10.85                  |
| Ordering Department| Keshi(sending department) |
| Patient Comment     | Beizhu(comment patient)   |
| Sample bar code     | 12345678                  |
| Sample Type         | Serum                     |
| Sample ID           | 10                        |
| Is sample ID or not | 10                        |
| STAT                | Yes                       |
| Test No.            | 2, 5 and 6                |
| Test                | TBil, ALT, AST            |
| Test results       | 100, 98.2 and 26.4        |
| Unit                | umol/L, umol/L and umol/L |


## Sample result sent by a mindray Immunoassay analyzer
<SB>MSH|^~\&|||||20120508094822||ORU^R01|1|P|2.3.1||||0||ASCII|||<CR>
PID|1|1001|||Mike||19851001095133|M|||keshi|||||||||||||||beizhu|||||<CR>
OBR|1|12345678|10|^|Y|20120405193926|20120405193914|20120405193914|||||l
inchuangzhenduan|20120405193914|serum|lincyisheng|keshi||||||||3|||||||||||||||||||||||<
CR>
OBX|1|NM|2|TBil|100| umol/L |-|N|||F||100|20120405194245||yishen|0|<CR>
OBX|2|NM|5|ALT|98.2| umol/L |-|N|||F||98.2|20120405194403||yishen|0|<CR>
OBX|3|NM|6|AST|26.4| umol/L |-|N|||F||26.4|||yishen||<CR>
<EB><CR>

LIS Host replies with
<SB>MSH|^~\&|||||20120508094823||ACK^R01|1|P|2.3.1||||0||ASCII|||<CR>
MSA|AR|1|Application query error|||206|<CR>
<EB><CR>


## Sample qc results sent by immunoassay equipment
<SB>MSH|^~\&|||||20120508103014||ORU^R01|1|P|2.3.1||||2||ASCII|||<CR>
OBR|1|7|AST|^|0|20130729160839|20120405141255|20130729161552|||1|2|QUA
L2|2222|20300101|0|M|55.000000|5.000000|0.137470|
nkat/L
|||||||||1||||||||||||||||||<CR>
<EB><CR>

LIS Host replies with
<SB>MSH|^~\&|||||20120508094823||ACK^R01|1|P|2.3.1||||2||ASCII|||<CR>
MSA|AA|1|Message accepted|||0|<CR>
<EB><CR>


# Humastar 100/200/300 - ASTM
## sample Humastar analyzer input data
H|\^&|||HSX00^V1.0|||||Host||P|1|20191218
P|1||2-FIDO||DEPARTMENT1|PETER MENGO|20050303|MALE|||||||||||||||||||||||||
C|1|||
O|1|||CALA|False||||||||||Serum|||||||||||||||
O|2|||GPT|False||||||||||Serum|||||||||||||||
O|3|||UREA|False||||||||||Serum|||||||||||||||
O|4|||BD-2|False||||||||||Serum|||||||||||||||
O|5|||BT-2|False||||||||||Serum|||||||||||||||
O|6|||CRE|False||||||||||Serum|||||||||||||||
P|2||3-DIANA||DEPARTMENT1|DILIBERTO KAMAU|20060000|MALE|||||||||||||||||||||||||
C|2|||
O|1|||CALA|False||||||||||Serum|||||||||||||||
O|2|||GPT|False||||||||||Serum|||||||||||||||
O|3|||UREA|False||||||||||Serum|||||||||||||||
O|4|||BD-2|False||||||||||Serum|||||||||||||||
O|5|||BT-2|False||||||||||Serum|||||||||||||||
O|6|||CRE|False||||||||||Serum|||||||||||||||
P|3||4-KIKI||DEPARTMENT1|AKINYI GIORGIO|20060000|FEMALE|||||||||||||||||||||||||
C|3|||
O|1|||CALA|False||||||||||Serum|||||||||||||||
O|2|||GPT|False||||||||||Serum|||||||||||||||
O|3|||UREA|False||||||||||Serum|||||||||||||||
O|4|||BD-2|False||||||||||Serum|||||||||||||||
O|5|||BT-2|False||||||||||Serum|||||||||||||||
O|6|||CRE|False||||||||||Serum|||||||||||||||
L||N

## sample Humastar analyzer output data
H|\^&|||Sphera^V1.0|||||Host||P|1|20191218103829
 P|1||2-FIDO||2-FIDO|||MALE|||||||||||||||||||||||||
  O|1|||GPT|False||||||||||Serum|||||||||||||||
   R|1|GPT||U / l||||-99000000000||||00010101000000|
  O|2|||UREA|False||||||||||Serum|||||||||||||||
   R|1|UREA||mg / dl||||-99000000000||||00010101000000|
 P|2||4-KIKI||4-KIKI|||FEMALE|||||||||||||||||||||||||
  O|1|||GPT|False||||||||||Serum|||||||||||||||
   R|1|GPT||U / l||||-99000000000||||00010101000000|
  O|2|||UREA|False||||||||||Serum|||||||||||||||
   R|1|UREA||mg / dl||||-99000000000||||00010101000000|
 P|3||3-DIANA||3-DIANA|||MALE|||||||||||||||||||||||||
  O|1|||GPT|False||||||||||Serum|||||||||||||||
   R|1|GPT||U / l||||-99000000000||||00010101000000|
  O|2|||UREA|False||||||||||Serum|||||||||||||||
   R|1|UREA||mg / dl||||-99000000000||||00010101000000|
L||N