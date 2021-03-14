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
$get('diseases', [query])

https://localhost/api/?route=diseases&params=[query]
```
### query
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