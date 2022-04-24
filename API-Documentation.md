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

  * **Code:** 200 <br />
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
  
  
  
   OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "You are unauthorized to make this request." }`
