// Initialize Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = "https://xbnnnketqwhpboopvwyx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhibm5ua2V0cXdocGJvb3B2d3l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4OTM0NDUsImV4cCI6MjA1NTQ2OTQ0NX0.a1KgH8BBpQspY5XGFMqs2iAVoBJsLCHR1h6Insj7BEE";  
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("registerForm")?.addEventListener("submit", async function (e) {
        e.preventDefault();
        await registerUser();
    });

    document.getElementById("loginForm")?.addEventListener("submit", async function (e) {
        e.preventDefault();
        await loginUser();
    });

    document.getElementById("logoutBtn")?.addEventListener("click", logoutUser);

    if (localStorage.getItem("loggedInUser")) {
        fetchUsers();
    }
});

// ✅ Function to Register User
async function registerUser() {
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const address = document.getElementById("registerAddress").value.trim();
    const state = document.getElementById("registerState").value.trim();
    const city = document.getElementById("registerCity").value.trim();

    if (!name || !email || !password || !address || !state || !city) {
        alert("Please fill all the fields.");
        return;
    }

    // Sign up user in authentication system
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        console.error("Sign-up Error:", error);
        alert("Error: " + error.message);
        return;
    }

    // Insert user details into 'users' table
    const { error: insertError } = await supabase
        .from("users")
        .insert([{ name, email, address, state, city }]);

    if (insertError) {
        console.error("Database Insert Error:", insertError);
        alert("Error saving user data: " + insertError.message);
        return;
    }

    alert("Registration successful! Please check you mail to verify.");
    document.getElementById("registerForm").reset();
}

// ✅ Function to Log In User
async function loginUser() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error("Login Error:", error);
        alert("Login failed: " + error.message);
        return;
    }

    // ✅ Fetch user details from 'users' table after successful login
    const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single(); // Fetch only one matching user

    if (userError || !userData) {
        console.error("User Fetch Error:", userError);
        alert("Login successful, but user data couldn't be fetched.");
        return;
    }

    // ✅ Store user data in localStorage
    localStorage.setItem("loggedInUser", JSON.stringify(userData));

    alert(`Login successful! Welcome, ${userData.name}`);
    fetchUsers(); // Refresh user list after login
}

// ✅ Function to Log Out User
async function logoutUser() {
    await supabase.auth.signOut();
    localStorage.removeItem("loggedInUser");
    alert("Logged out!");
    document.getElementById("usersList").innerHTML = ""; // Clear UI
}

// ✅ Fetch and Display Registered Users
// async function fetchUsers() {
//     const { data: sessionData, error: sessionError } = await supabase.auth.getUser();

//     if (sessionError || !sessionData?.user) {
//         console.error("User session not found:", sessionError);
//         alert("Please log in first!");
//         return;
//     }

//     const { data, error } = await supabase.from("users").select("*");

//     if (error) {
//         console.error("Fetch Users Error:", error);
//         alert("Error fetching users: " + error.message);
//         return;
//     }

//     console.log("Users fetched:", data);

//     const usersList = document.getElementById("usersList");
//     if (!usersList) return;

//     usersList.innerHTML = "";
//     data.forEach(user => {
//         usersList.innerHTML += `<p><strong>${user.name}</strong> - ${user.email} - ${user.city}, ${user.state}</p>`;
//     });
// }


// async function fetchUsers() {
//     const adminEmail = "bhamratanveer00612@gmail.com"; // 🔴 Replace with your actual admin email

//     // ✅ Fetch the latest users from Supabase (do not use cached data)
//     const { data, error } = await supabase.from("users").select("*");

//     if (error) {
//         console.error("Fetch Users Error:", error);
//         alert("Error fetching users: " + error.message);
//         return;
//     }

//     console.log("Users fetched from database:", data);

//     const usersList = document.getElementById("usersList");
//     if (!usersList) return;

//     usersList.innerHTML = "<h3>Registered Members</h3>";
//     data.forEach(user => {
//         usersList.innerHTML += `<p><strong>${user.name}</strong> - ${user.email} - ${user.city}, ${user.state}</p>`;
//     });

//     // ✅ Auto-login admin if no user is logged in
//     let loggedInUser = localStorage.getItem("loggedInUser");
//     if (!loggedInUser || loggedInUser !== adminEmail) {
//         localStorage.setItem("loggedInUser", adminEmail);
//         console.log("Admin auto-logged in as:", adminEmail);
//     }
// }


/////.......Table interface......./////
// async function fetchUsers() {
//     const adminEmail = "bhamratanveer00612@gmail.com";
//     // const adminEmail = "bhamratanveer00612@gmail.com";

//     const { data, error } = await supabase.from("users").select("*");
//     if (error) {
//         console.error("Fetch Users Error:", error);
//         alert("Error fetching users: " + error.message);
//         return;
//     }
//     console.log("Users fetched from database:", data);
//     const usersList = document.getElementById("usersList");
//     if (!usersList) return;
//     usersList.innerHTML = "";
//     data.forEach(user => {
//         usersList.innerHTML += `
//             <tr>
//                 <td>${user.name}</td>
//                 <td>${user.email}</td>
//                 <td>${user.city}</td>
//                 <td>${user.state}</td>
//                 <td>${user.email === adminEmail ? '<span class="admin-badge">Admin</span>' : 'Member'}</td>
//             </tr>`;
//     });
//     let loggedInUser = localStorage.getItem("loggedInUser");
//     if (!loggedInUser || loggedInUser !== adminEmail) {
//         localStorage.setItem("loggedInUser", adminEmail);
//         console.log("Admin auto-logged in as:", adminEmail);
//     }
// }
// fetchUsers();



/////.......Card interface......./////
// async function fetchUsers() {
//     const adminEmail = "bhamratanveer00612@gmail.com";

//     const { data, error } = await supabase.from("users").select("*");
//     if (error) {
//         console.error("Fetch Users Error:", error);
//         alert("Error fetching users: " + error.message);
//         return;
//     }
//     console.log("Users fetched from database:", data);
//     const usersList = document.getElementById("usersList");
//     if (!usersList) return;
//     usersList.innerHTML = "";
//     data.forEach(user => {
//         usersList.innerHTML += `
//     <div class="card mb-3 p-3 shadow-sm w-100" style="max-width: 500px;">
//         <h5 class="fw-bold">${user.name}</h5>
//         <p class="mb-1"><strong>Email:</strong> ${user.email}</p>
//         <p class="mb-1"><strong>Location:</strong> ${user.city}, ${user.state}</p>
//         <p class="mb-0">${user.email === adminEmail ? '<span class="badge bg-warning text-dark">Admin</span>' : 'Member'}</p>
//     </div>
// `;

//     });
//     let loggedInUser = localStorage.getItem("loggedInUser");
//     if (!loggedInUser || loggedInUser !== adminEmail) {
//         localStorage.setItem("loggedInUser", adminEmail);
//         console.log("Admin auto-logged in as:", adminEmail);
//     }
// }
// fetchUsers();



//.......Multiple admin table......//
// async function fetchUsers() {
//     const adminEmails = ["bhamratanveer00612@gmail.com", "madhushry12@gmail.com", "admin3@example.com"];

    // ✅ Fetch users from Supabase
    // const { data, error } = await supabase.from("users").select("*");
    // if (error) {
    //     console.error("Fetch Users Error:", error);
    //     alert("Error fetching users: " + error.message);
    //     return;
    // }

    // console.log("Users fetched from database:", data);
    // const usersList = document.getElementById("usersList");
    // if (!usersList) return;

    // ✅ Clear previous content before updating
    // usersList.innerHTML = "";

    // data.forEach(user => {
    //     const isAdmin = adminEmails.includes(user.email); // ✅ Corrected admin check

    //     usersList.innerHTML += `
    //         <tr>
    //             <td>${user.name}</td>
    //             <td>${user.email}</td>
    //             <td>${user.city}</td>
    //             <td>${user.state}</td>
    //             <td>${isAdmin ? '<span class="admin-badge">Admin</span>' : 'Member'}</td>
    //         </tr>`;
    // });

    // ✅ Auto-login logic correction
//     let loggedInUser = localStorage.getItem("loggedInUser");
//     if (!loggedInUser || !adminEmails.includes(loggedInUser)) {
//         localStorage.setItem("loggedInUser", adminEmails[0]); // Logs in first admin
//         console.log("Admin auto-logged in as:", adminEmails[0]);
//     }
// }

// Call the function
// fetchUsers();


//.. Cards ui for multiple admin...///
async function fetchUsers() {
    const adminEmails = ["bhamratanveer00612@gmail.com", "madhushry12@gmail.com", "admin3@example.com"];

    // ✅ Fetch users from Supabase
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
        console.error("Fetch Users Error:", error);
        alert("Error fetching users: " + error.message);
        return;
    }

    console.log("Users fetched from database:", data);
    const usersList = document.getElementById("usersList");
    if (!usersList) return;

    // ✅ Clear previous content before updating
    usersList.innerHTML = "";

    data.forEach(user => {
        const isAdmin = adminEmails.includes(user.email); // ✅ Corrected admin check

        usersList.innerHTML += `
            <div class="card user-card ${isAdmin ? 'admin-card' : 'member-card'}">
                <h3>${user.name}</h3>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Location:</strong> ${user.city}, ${user.state}</p>
                <span class="role-badge ${isAdmin ? 'admin-badge' : 'member-badge'}">
                    ${isAdmin ? 'Admin' : 'Member'}
                </span>
            </div>`;
    });

    // ✅ Auto-login logic correction (Logs in first admin)
    let loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser || !adminEmails.includes(loggedInUser)) {
        localStorage.setItem("loggedInUser", adminEmails[0]); // Logs in first admin
        console.log("Admin auto-logged in as:", adminEmails[0]);
    }
}

// Call the function
fetchUsers();




// ✅ Call fetchUsers() automatically on page load
// fetchUsers();
