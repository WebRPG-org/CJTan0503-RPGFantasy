/*:
 * @plugindesc A plugin to handle user login/logout using a PHP backend.
 * @author YourName
 * 
 * @help
 * This plugin uses AJAX requests to communicate with a PHP backend.
 */

var LoginSystem = LoginSystem || {};

(function() {
    // Initialize when DataManager becomes available
    var _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        $gameUser = {
            username: localStorage.getItem("currentUser") || null,
            isLoggedIn: function() {
                return this.username !== null;
            }
        };
    };

    // Add methods to check login status
    Game_System.prototype.isUserLoggedIn = function() {
        return $gameUser && $gameUser.isLoggedIn();
    };

    Game_System.prototype.getCurrentUser = function() {
        return $gameUser ? $gameUser.username : null;
    };

    // Handle login response
    xhr.onload = function() {
        try {
            const response = JSON.parse(this.responseText);
            if (response.status === "success") {
                localStorage.setItem("currentUser", response.username);
                window.location.replace("/RPGProject/Project1/index.html");
            } else {
                console.error("Login Failed:", response.message);
            }
        } catch (e) {
            console.error("Failed to parse response:", e);
        }
    };

    function loginUser(username, password) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "login-system/src/login.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onload = function() {
            try {
                const response = JSON.parse(xhr.responseText);
                console.log("Login response:", response); // Debug log
                if (response.status === "success") {
                    localStorage.setItem("currentUser", response.username);
                    window.location.href = "/RPGProject/Project1/index.html";
                } else {
                    console.error("Login Failed:", response.message);
                }
            } catch (e) {
                console.error("Error parsing response:", e);
            }
        };

        const data = new URLSearchParams();
        data.append('username', username);
        data.append('password', password);
        xhr.send(data);
    }

    // Make sure to expose the function globally
    window.loginUser = loginUser;
})();