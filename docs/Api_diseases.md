---
title: Diseases
parent: API
nav_order: 1
---

# Diseases
{: .no_toc }

Fetch disease data from orca.

- TOC
{:toc}

# Get

Get disease names from orca based on search string or disease code.

## Request
{: .no_toc }

```
$get('diseases', [data])

/api/?route=diseases&params=[query]
```
### [data]
{: .no_toc }

Search string or disease code.

**Required**

**Type**: *Sting, Integer*

## Response
{: .no_toc }

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

Update diseases for a patient. This includes register, update and delete (all these are actually update operations)

## Request
{: .no_toc }
```
$put('diseases/[itemId]', [data])

/api/?route=diseases/[itemId]
```
### [itemId]
{: .no_toc }
Patient ID to update disease data.

**Required**

**Type**: *Integer*

### [data]
{: .no_toc }

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
    patient_ID: 8,
    shinsatu_ID: 108
}
```

**Parameters**

[Orca reference](https://www.orca.med.or.jp/receipt/tec/api/diseasemod2.html)

- Insurance_ID: Insurance id *String*
- Disease_Category: Main disease flag *String*

    PD: Main disease,
    *empty*: Not main disease
- Disease_EndDate: End date *String*
- Disease_Name: Name of disease *String*
- Disease_OutCome: New status of disease *Sting*

    O：削除,
    F：完治,
    N：不変,
    R：軽快,
    S：後遺症残,
    U：不明,
    W：悪化,
    P：中止

- Disease_Supplement_Name: Additional info *String*
- Disease_Receipt_Print: Show or hide on Reciept *String*

    1: Don't show,
    *empty*: show
- Disease_StartDate: Start date *String*
- Disease_SuspectedFlag: Suspected flag. *String*

    *empty* なし,
    S: 疑い,
    A: 急性,
    SA: 疑いかつ急性

- Disease_Single: Disease code *String*
- Department_Code: Department_Code *string*
- Insurance_Combination_Number: Insurance set number *string*
- patient_ID: Patient Id *Integer*
- shinsatu_ID: Record Id *Integer*

## Response
{: .no_toc }

```
{
    data: {}
    message: ""
    success: true
}
```