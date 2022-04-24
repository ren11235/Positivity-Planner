**Get Events for a User**
----
  Returns json data for each event that a user has.

* **URL**

  /planner/{id}

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `id=[string]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200  OK <br />
    **Content:** `{ user_id : "00000000-0000-0000-0000-000000000000", id : "00000000-0000-0000-0000-000000000000", title : "Event 1", start : "2022-04-20T20:00:00.000Z", end : "2022-04-20T21:00:00.000Z", primary: "#000000", secondary: "#000000" }`
 
* **Error Response:**

  * **Code:** 500 Internal Server Error <br />

 

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/planner/00000000-0000-0000-0000-000000000000",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```
  
**Add Event for a User**
----
Adds an event for a user to database.

* **URL**

  /planner/{id}

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   `id=[string]`

* **Data Params**

  **Required:**
  
  `title=[string]` <br />
  `start=[string]` <br />
  `end=[string]` <br />
  `primary=[string]` <br />
  `secondary=[string]` <br />

* **Success Response:**

  * **Code:** 201 Created <br />
 
* **Error Response:**

  * **Code:** 500 Internal Server Error <br />
 OR
  * **Code:** 400 Bad Request <br />

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/planner/00000000-0000-0000-0000-000000000000",
      data: {title: "New Test Event", start: "2022-04-20T20:00:00.000Z", end: "2022-04-20T21:00:00.000Z",   primary: "#000000", secondary: "000000"
	}`
      dataType: "json",
      type : "POST",
      success : function(r) {
        console.log(r);
      }
    });
  ```
  
**Update Specific User Event**
----
Updates an event for a user in database.

* **URL**

  /planner/{id1}/{id2}

* **Method:**

  `PUT`
  
*  **URL Params**

   **Required:**
 
   `id1=[string]` <br />
   `id2=[string]` <br />

* **Data Params**

  **Required:**
  
  `title=[string]` <br />
  `start=[string]` <br />
  `end=[string]` <br />
  `primary=[string]` <br />
  `secondary=[string]` <br />

* **Success Response:**

  * **Code:** 200 OK <br />
 
* **Error Response:**

  * **Code:** 500 Internal Server Error <br />
  OR
  * **Code:** 400 Bad Request <br />

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/planner/00000000-0000-0000-0000-000000000000/00000000-0000-0000-0000-000000000000",
      data: {title: "New Test Event", start: "2022-04-20T20:00:00.000Z", end: "2022-04-20T21:00:00.000Z", primary: "#000000", secondary: "000000"
	}
      dataType: "json",
      type : "PUT",
      success : function(r) {
        console.log(r);
      }
    });
  ```
  
**Delete Specific User Event**
----
Deletes an event for a user in database.

* **URL**

  /planner/{id1}/{id2}

* **Method:**

  `DELETE`
  
*  **URL Params**

   **Required:**
 
   `id1=[string]` <br />
   `id2=[string]` <br />

* **Data Params**
None

* **Success Response:**

  * **Code:** 200 OK <br />
 
* **Error Response:**

  * **Code:** 500 Internal Server Error <br />

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/planner/00000000-0000-0000-0000-000000000000/00000000-0000-0000-0000-000000000000",
      
      dataType: "json",
      type : "DELETE",
      success : function(r) {
        console.log(r);
      }
    });
  ```

**Register a New User**
----
Registers a new user and adds user data to database.

* **URL**

  /users/register

* **Method:**

  `POST`
  
*  **URL Params**

   None

* **Data Params**

  **Required:**
  `username=[string]` <br />
  `password=[string]` <br />
  `firstName=[string]` <br />
  `lastName=[string]` <br />

* **Success Response:**

  * **Code:** 201 Created <br />
 
* **Error Response:**

  * **Code:** 500 Internal Server Error <br />
  OR
  * **Code:** 400 Bad Request <br />

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/users/register",
      data: {username: "USERNAME", password: "PASSWORD", firstName: "FIRSTNAME", lastName: "LASTNAME"}
      dataType: "json",
      type : "POST",
      success : function(r) {
        console.log(r);
      }
    });
  ```
  
**Login**
----
Allow a previously registered user to login.

* **URL**

  /users/auth

* **Method:**

  `POST`
  
*  **URL Params**

   None

* **Data Params**

  **Required:**
  `username=[string]` <br />
  `password=[string]` <br />

* **Success Response:**

  * **Code:** 200 OK <br />
 
* **Error Response:**

  * **Code:** 500 Internal Server Error <br />
  OR
  * **Code:** 400 Bad Request <br />

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/users/register",
      data: {username: "USERNAME", password: "PASSWORD"}
      dataType: "json",
      type : "POST",
      success : function(r) {
        console.log(r);
      }
    });
  ```
  
**Delete Existing User**
----
Deletes an existing user from the database.

* **URL**

  /users/{id}

* **Method:**

  `DELETE`
  
*  **URL Params**

    **Required:**
 
   `id=[string]` <br />

* **Data Params**

 None

* **Success Response:**

  * **Code:** 200 OK <br />
 
* **Error Response:**

  * **Code:** 500 Internal Server Error <br />

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/users/00000000-0000-0000-0000-000000000000",
      data: {username: "USERNAME", password: "PASSWORD"}
      dataType: "json",
      type : "DELETE",
      success : function(r) {
        console.log(r);
      }
    });
  ```
 
   
  
