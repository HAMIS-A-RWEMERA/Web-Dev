/**
 * ==========================================================================
 * RUSUMO HIGH SCHOOL - FRONTEND ARCHITECTURE ENGINE (VANILLA JS)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // Core Element Target Map
    const appHeader = document.querySelector("header");
    const navMenu = document.getElementById("nav-menu");
    const portalForm = document.querySelector("#portal form");

    /* ==========================================================================
       1. HARDWARE-ACCELERATED MOBILE MENU MECHANICS
       ========================================================================== */
    let menuBtn = document.querySelector("nav button");
    if (menuBtn) {
        menuBtn.addEventListener("click", () => {
            const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
            
            menuBtn.setAttribute("aria-expanded", !isExpanded);
            navMenu.classList.toggle("mobile-active");
            
            menuBtn.textContent = isExpanded ? "Menu" : "Close";
            menuBtn.style.color = isExpanded ? "var(--text-primary)" : "var(--accent-cyan)";
        });
    }

    /* ==========================================================================
       2. SCROLL INTERSECTION & LIQUID HEADER SHIFT
       ========================================================================== */
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            appHeader.style.padding = "10px 5vw";
            appHeader.style.background = "rgba(6, 9, 19, 0.92)";
            appHeader.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.5)";
        } else {
            appHeader.style.padding = "15px 5vw";
            appHeader.style.background = "rgba(10, 15, 29, 0.75)";
            appHeader.style.boxShadow = "none";
        }
    });

    /* ==========================================================================
       3. INTERACTIVE PARENT PORTAL - LIVE DATABASE PIPELINE
       ========================================================================== */
    if (portalForm) {
        portalForm.addEventListener("submit", (event) => {
            // Prevent native browser page refresh
            event.preventDefault();

            // Extract input values manually
            const studentIdInput = document.getElementById("student-id").value.trim();
            const pinInput = document.getElementById("access-pin").value;
            const submitBtn = portalForm.querySelector("button");

            // UI Feedback Loading State
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = "Querying Live SQLite Matrix...";
            submitBtn.style.background = "linear-gradient(90deg, var(--accent-purple), var(--accent-purple))";

            // Fire real network request to our backend Node server
            fetch('/api/reports.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ student_id: studentIdInput, access_pin: pinInput })
            })
            .then(res => {
                // Return raw json stream parse promise
                return res.json();
            })
            .then(data => {
                // CRITICAL FIX: Evaluate database record validation flags sent by Node
                if (data.success === true) {
                    alert(`
🔓 [SECURE CONNECTION GRANTED]
--------------------------------------------------
Student Name: ${data.payload.student_name}
Class Node:   ${data.payload.class}
Performance:  ${data.payload.term_performance}
Discipline:   ${data.payload.conduct}
Financials:   ${data.payload.financials}
                    `);
                    portalForm.reset();
                } else {
                    // Block unauthorized access cleanly
                    alert(`❌ [SECURITY AUTH FAILURE]: ${data.message}`);
                }
            })
            .catch(err => {
                console.error("Network Fail:", err);
                alert("❌ Connection lost with the Rusumo Database Core Node.");
            })
            .finally(() => {
                // Restore button status and animations regardless of response outcome
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                submitBtn.style.background = "linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))";
            });
        });
    }
        /* ==========================================================================
       4. INTERACTIVE CAMPUS SEARCH FILTER ENGINE
       ========================================================================== */
    const searchInput = document.getElementById("academic-search");
    // Target all list items inside your combinations section wrapper
    const academicCards = document.querySelectorAll("#academics li");

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();

            academicCards.forEach(card => {
                const cardText = card.textContent.toLowerCase();
                
                // Low-level string matching comparison logic
                if (cardText.includes(query)) {
                    card.style.display = "block";
                    card.style.opacity = "1";
                } else {
                    card.style.display = "none";
                    card.style.opacity = "0";
                }
            });
        });
    }

});
