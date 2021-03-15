---
title: Diseases
parent: API
nav_order: 1
---

# Diseases

Fetch disease data from orca.

# Get

Get disease names from orca based on search string or disease code.

## Request
```
$get('diseases', [data])

/api/?route=diseases&params=[query]
```
### [data]
Search string or disease code.

**Required**

**Type**: *Sting, Integer*

## Response

```
{
    "message": "",
    "success": true,
    "data": [
        {
            "byomeicd": "8849852",
            "byomei": "ＣＭ関節外傷性変形性関節症"
        },
        {
            "byomeicd": "8849853",
            "byomei": "ＣＭ関節原発性変形性関節症"
        },
        {
            "byomeicd": "8849854",
            "byomei": "ＣＭ関節続発性変形性関節症"
        }
    ]
}
```

# Update

Get disease names from orca based on search string or disease code.

## Request
```
$put('diseases/[itemId]', [data])

/api/?route=diseases/[itemId]
```
### [itemId]
Patient ID to update disease data.

**Required**

**Type**: *Integer*

### [data]

**Type**: *Object*

**Example**
```
{
    Insurance_ID: "0003",
    Disease_Category: "",
    Disease_EndDate: null,
    Disease_Name: "ＭＥＣＰ２重複症候群",
    Disease_OutCome: "",
    Disease_Supplement_Name: "片側",
    Disease_Receipt_Print: "1",
    Disease_StartDate: "2020-08-11",
    Disease_SuspectedFlag: "A",
    Disease_Single: "8849859",
    Department_Code: "01",
    Insurance_Combination_Number: "0001",
    Insurance_Disease: "False",
    patient_ID: 8,
    shinsatu_ID: 108
}
```

**Parameters**

- Insurance_ID: Something

## Response

```
{
    data: {}
    message: ""
    success: true
}
```