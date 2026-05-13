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
    // Inject the low-level functional layout state button dynamically if missing
    let menuBtn = document.querySelector("nav button");
    if (menuBtn) {
        menuBtn.addEventListener("click", () => {
            const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
            
            // Toggle state tags for accessibility mapping
            menuBtn.setAttribute("aria-expanded", !isExpanded);
            navMenu.classList.toggle("mobile-active");
            
            // Visual feedback loop
            menuBtn.textContent = isExpanded ? "Menu" : "Close";
            menuBtn.style.color = isExpanded ? "var(--text-primary)" : "var(--accent-cyan)";
        });
    }

    /* ==========================================================================
       2. SCROLL INTERSECTION & LIQUID HEADER SHIFT
       ========================================================================== */
    window.addEventListener("scroll", () => {
        // High-performance scroll monitor
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
       3. INTERACTIVE PARENT PORTAL SIMULATOR (FORM STRIPPING)
       ========================================================================== */
    if (portalForm) {
        portalForm.addEventListener("submit", (event) => {
            // Prevent native browser page refresh to control the payload pipeline
            event.preventDefault();

            // Extract values manually from input nodes
            const studentIdInput = document.getElementById("student-id").value.trim();
            const pinInput = document.getElementById("access-pin").value;
            const submitBtn = portalForm.querySelector("button");

            // UI Feedback State: Initiating simulated secure network stream
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = "Connecting Secure Database Node...";
            submitBtn.style.background = "linear-gradient(90deg, var(--accent-purple), var(--accent-purple))";

            // Low-level processing emulation via controlled timeouts
            setTimeout(() => {
                // Verification routine (for frontend mock testing)
                // Accepts any valid formatted string for demonstration
                if (studentIdInput.startsWith("RHS-") && pinInput.length === 4) {
                    
                    // Create simulated secure success payload layout
                    alert(`
🔓 [SECURE CONNECTION GRANTED]
--------------------------------------------------
Student Target ID: ${studentIdInput}
Status: Academic Record Decrypted Successfully

Redirecting to student portfolio node...
                    `);
                    
                    // Reset interface state variables
                    portalForm.reset();
                } else {
                    alert("❌ [SECURITY ALERT]: Invalid Identification format or incorrect PIN sequence.");
                }

                // Restore interface interactives
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                submitBtn.style.background = "linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))";

            }, 1800); // 1.8 second natural system calculation simulation latency
        });
    }
});
