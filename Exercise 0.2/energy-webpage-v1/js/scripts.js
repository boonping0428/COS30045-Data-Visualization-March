function switchPage(page) {
    // Hide all page contents
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(p => p.classList.remove('active-page'));

    // Show the selected page
    const activePage = document.getElementById(page);
    if (activePage) {
        activePage.classList.add('active-page');
    }

    // Update navigation active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Find the nav item that corresponds to the page
    const activeNav = document.querySelector(`.nav-item[onclick="switchPage('${page}')"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }
}

// Initialize the home page as active on load
document.addEventListener('DOMContentLoaded', function() {
    switchPage('home');
});
