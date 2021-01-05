# winterbreak

```
$ cd app
$ npm start
--
$ conda activate winter
$ cd app/src
$ python3 App.py
```

### known bugs

-   maps markers may be centered around the location of a different user
    -   e.g. nick fetches vet locations around palo alto, resulting in shannon's fetch to vet locations returning palo alto markers (should be san jose)

### future improvements

-   places API autocomplete for city/state during signup
-   click on map to clear all info windows
-   display more information in each info window
