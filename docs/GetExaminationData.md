---
title: Update Examination Data in Mongo DB
has_children: false
nav_order: 3
---

# Update Examination Data in Mongo DB

- Get the latest list from https://www2.medis.or.jp/master/kensa/index.html
- Delete all rows not data (usually from 1-8 and on the bottom)
- Delete column A (if empty)
- export to CSV
- Open file and past below on top:<br>
JLACCodeShort,JLACCodeLong,item.flag,item.code,item.name,itemDetail.flag,itemDetail.code,itemDetail.name,sample.flag,sample.code,sample.name,method.flag,method.code,method.name,result.shared.flag,result.shared.code,result.shared.name,result.single.flag,result.single.name,combinedCode,defaultName,unit.code,unit.name,insuranceIncluded,procedure.code,procedure.name,procedure.name2,points,section,classCode,itemCode,changeDate
- Save CSV
- Truncate collection in Mongo DB (db.<collection>.remove({})) and import from VSC (deselect "ignore empty strings")