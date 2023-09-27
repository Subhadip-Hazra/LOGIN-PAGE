document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector(".login-form");
    const loginMessage = document.getElementById("login-message");

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            // Send a request to check if the email exists
            fetch("http://localhost:5500/check-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                if (data.exists) {
                    const loginData = { email, password };

                    // Send a request to login
                    fetch("http://localhost:5500/login", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(loginData),
                    })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`Login request failed with status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((loginResult) => {
                        if (loginResult.success) {
                            // Login successful, redirect to the "page.html" page
                            window.location.href = "subscription.html";
                        } else {
                            if (loginResult.message === "Invalid password") {
                                // Invalid password, show an error message
                                loginMessage.textContent = 'Invalid password. Please enter the correct password.';
                            } else {
                                // Other login failure, show a general error message
                                loginMessage.textContent = 'Login failed. Please check your credentials.';
                            }
                        }
                    })
                    .catch((loginError) => {
                        console.error('Login Error:', loginError);
                        loginMessage.textContent = 'An error occurred during login.';
                    });
                } else {
                    // Email doesn't exist, show a message
                    loginMessage.textContent = 'You are not a registered user. Please register first.';
                }
            })
            .catch((error) => {
                console.error('Check Email Error:', error);
                loginMessage.textContent = 'An error occurred during email verification.';
            });
        });
    }
});