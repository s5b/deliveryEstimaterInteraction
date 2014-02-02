Delivery Estimater Interaction
==============================

An example of passing state via the URL using hash fragments, using Angular JS. 

The idea is to provide separation between the entry of information through a form, and the display of results once the form is submitted. By separating these components, it allows the form to be placed on one or more pages, with the results appearing on one or more pages, too.

For example, there may be a main page for using the form and its results, while the different version of the form is provided as a quick entry point from another section of the site.

Running the Example
-------------------

The application is built using the [Angular Seed] [1] code base. (See the acknowledgements below.) It, therefore requires you to install [nodejs] [2] to run the application. 

Having installed nodejs, from the base directory enter the following command:

	./scripts/web_server.js

This will start the webserver, serving the application. Next, navigate to the following URL in your favourite browser (Be warned that it has only been tested in Google Chrome, but should work in other browsers, too.)

<http://localhost:8000/app/index.html>

This will take you to the main page of the application.

* You should see errors surrounding the postcode pickers, because nothing has been selected.
* The date entry is not very sophisticated in the example. So long as you enter a valid ISO 8601 date into the field you should be fine.
* Pressing the "estimate" button will add the parameter values to the URL.
* Changing the values in the URL will change the values on the form - so long as the values are valid. Invalid URL values will be silently ignored. (This is a feature.)

Tests
-----

The tests are yet to be updated from the AngularJS seed. 

Acknowledgements
----------------

This example is based on the [AngularJS seed][1]. Some of the files from the AngularJS seed that are not needed for this example have been removed. The included README for AngularJS (README.angular-seed.md) has not been adjusted to reflect these changes. The AngularJS README is included to provide some additional context for the implementation that is not covered here in this document.

The example is also based on a [technique][3] I saw demonstrated by Glen Maddern for communicating state changes between components using $scope. The approach was shown by Glen is his talk at [NgMelb][4].

[1]: https://github.com/angular/angular-seed
[2]: http://nodejs.org/
[3]: https://github.com/geelen/ngmelb-controller-comms
[4]: https://twitter.com/ngMelb
