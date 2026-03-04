// About Page Interactive Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Hide all sections initially except the first one
    contentSections.forEach((section, index) => {
        if (index !== 0) {
            section.style.display = 'none';
        }
    });
    
    // Add click event listeners to navigation buttons
    navButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all content sections
            contentSections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show the corresponding content section
            if (contentSections[index]) {
                contentSections[index].style.display = 'block';
                contentSections[index].scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }
        });
    });
    
    // Set the first button as active by default
    if (navButtons.length > 0) {
        navButtons[0].classList.add('active');
    }
});
