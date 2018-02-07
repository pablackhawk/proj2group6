const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: "8889",
    user: "root",
    password: "root",
    database: "survival_db",
});

connection.connect(function(err) {
    if (err) throw err;
    // console.log("Connected as id: " + connection.threadId);
    displayProducts();
});

function displayProducts() {
    console.log("\n**** STATE OF APOCALYPSE - All Products ****")
    connection.query("SELECT * FROM Products", function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("\n -----------------------------------------------------------------------------")
            console.log(
                        "| Item Number: " +
                        res[i].item_num +
                        " | Product Name: " +
                        res[i].product_name +
                        " | Item Description: " +
                        res[i].itemDescription +
                        " | Category: " +
                        res[i].category +
                        " | Score: " +
                        res[i].score +
                        " | Buy Link: " +
                        res[i].buy_link) +
                        " | Video Link: " +
                        res[i].video_link+
                        " | Image Link: " +
                        res[i].image_link+
                        " | Review Link: " +
                        res[i].review_link;
            console.log("\n -----------------------------------------------------------------------------");
        }
        initialize();
    });
};

function initialize() {
    inquirer.prompt([{
        name: "addItem",
        type: "rawlist",
        message: "Would you like to add a product to 'survival_db' database?",
        choices: ["YES", "NO"]        
    }
    ]).then(function(answer) {
        if (answer.addItem.toUpperCase() === "YES") {
            addItem();
        } else {
            deleteProduct();
        }   
    });
}

function addItem() {
    inquirer.prompt([{
            name: "itemNumber",
            type: "input",
            message: "Please enter the 'item_number' of the new product."
        },{
            name: "productName",
            type: "input",
            message: "Please enter the name of the product you would like to add to the database."
        },{
            name: "itemDescription",
            type: "input",
            message: "Enter the description of the product to store..."
        },{
            name: "category",
            type: "input",
            message: "What category would you like to place this item in?",
        },{
            name: "score",
            type: "input",
            message: "What is the editor's score for this product?"
            //  validate: function(value) {
            //     if (isNaN(value) === false) {
            //     return true;
            //     }
            //     return false;
            //     }
        },{
            name: "buyLink",
            type: "input",
            message: "What is the 'buy_link' you would like to store with this item?"
        },{
            name: "videoLink",
            type: "input",
            message: "What is the 'video_link' you would like to store with this item?"
        },{
            name: "imageLink",
            type: "input",
            message: "What is the 'image_link' you would like to store with this item?"
        },{
            name: "reviewLink",
            type: "input",
            message: "What is the 'review_link' you would like to store with this item?"
        }
    ]).then(function(answer) {
        connection.query("UPDATE Products SET ? WHERE ?",
        [
          {
            item_num: answer.itemNumber
          },
          {
            product_name: answer.productName
          },
          {
            description: answer.itemDescription
          },
          {
            category: answer.category
          },
          {
            score: answer.score
          },
          {
            buy_link: answer.buyLink
          },
          {
            video_link: answer.videoLink
          },
          {
            image_link: answer.imageLink
          },
          {
            review_link: answer.reviewLink
          }
        ], function(err) {
            if (err) throw err;

            console.log("Your product has been successfully added to 'surviva;_db'!");
            console.log("===================================================================");
            resetOption();
        })
    })
 }

 function resetOption() {
    inquirer.prompt({
        name: "done",
        type: "rawlist",
        message: "Have you done all you need?",
        choices: ["YES", "NO"]
    }). then(function(answer){
        if (answer.done.toUpperCase() === "YES") {
            console.log("---------------------------------------------\n*** See ya next time!")
            console.log("---------------------------------------------");
            connection.end();
        } else {
            console.log("***\nReturning to Home...\n");
            displayProducts();
        }
    })
 }

function deleteProduct() {
    inquirer.prompt([
        {
            name: "addItem",
            type: "rawlist",
            message: "Would you like to delete a product from the 'survival_db' database?",
            choices: ["YES", "NO"] 
        }
    ]).then(function(answer) {
        if (answer.addItem.toUpperCase() === "YES") {
            deleteItemNumber();
        } else {
            console.log("*** Ok, Goodbye!");
            connection.end(); 
        }
    })
}


  function deleteItemNumber() {
    inquirer.prompt([
        {
            name: "itemNumberDelete",
            type: "input",
            message: "Please enter the 'item_number' of the product you would like to remove from the 'survival_db'"
        }
    ]).then(function(answer) {
        console.log("Deleting product...\n");
        connection.query("DELETE FROM Products WHERE ?", { item_num: answer.itemNumberDelete }, 
            function(err) {
                if (err) throw err;
                console.log("Product deleted!");
                initialize();
        })
    })
  }