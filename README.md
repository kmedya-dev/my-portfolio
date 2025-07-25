# My Portfolio Fullstack

A personal portfolio website built with Django, showcasing projects, blog posts, and courses. This application is designed to be a full-stack solution, providing both a backend API and a frontend presentation.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup (Local Development)](#setup-local-development)
- [Deployment (Render)](#deployment-render)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Homepage**: A landing page to introduce the portfolio owner.
- **Projects Section**: Display various projects with details.
- **Blog Section**: Share articles and insights.
- **Courses Section**: List educational courses or certifications.
- **Admin Panel**: Django's built-in admin interface for content management.
- **Static File Serving**: Efficient serving of static assets using Whitenoise.

## Technologies Used

- **Backend**:
    - Python 3.12.11
    - Django (Web Framework)
    - Gunicorn (WSGI HTTP Server)
    - Whitenoise (Static File Serving)
    - dj-database-url (Database URL parsing)
    - psycopg2-binary (PostgreSQL adapter)
- **Frontend**:
    - HTML5
    - CSS3
    - JavaScript
- **Database**:
    - PostgreSQL (Production)
    - SQLite3 (Development)
- **Deployment**:
    - Render

## Project Structure

```
my_portfolio-fullstack/
├── blog/                 # Django app for blog posts
├── courses/              # Django app for courses/certifications
├── homepage/             # Django app for the main landing page
├── my_portfolio_backend/ # Main Django project settings, URLs, WSGI
├── projects/             # Django app for portfolio projects
├── staticfiles/          # Collected static files for deployment
├── media/                # User-uploaded media files
├── venv/                 # Python virtual environment
├── manage.py             # Django's command-line utility
├── requirements.txt      # Python dependencies
├── build.sh              # Script for Render build process
├── render.yaml           # Render deployment blueprint
├── runtime.txt           # Specifies Python version for deployment
└── README.md             # Project README file
```

## Setup (Local Development)

Follow these steps to get your development environment running:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/kmedya-dev/my-portfolio.git
    cd my-portfolio/my_portfolio-fullstack
    ```

2.  **Create a virtual environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Apply database migrations:**
    ```bash
    python manage.py migrate
    ```

5.  **Create a superuser (for admin access):**
    ```bash
    python manage.py createsuperuser
    ```
    Follow the prompts to create your admin user.

6.  **Run the development server:**
    ```bash
    python manage.py runserver
    ```
    The application will be available at `http://127.0.0.1:8000/`. The admin panel will be at `http://127.0.0.1:8000/admin/`.

## Deployment (Render)

This project is configured for deployment on [Render](https://render.com/) using a `render.yaml` blueprint.

1.  **Push to GitHub/GitLab:** Ensure your project is pushed to a Git repository (e.g., GitHub, GitLab).

2.  **Connect to Render:**
    *   Go to the [Render Dashboard](https://dashboard.render.com/).
    *   Click **New +** and select **Blueprint**.
    *   Connect the repository containing this project.
    *   Render will automatically detect and use the `render.yaml` file to set up your web service and PostgreSQL database.

3.  **Environment Variables:** Render will automatically handle `DATABASE_URL` and `SECRET_KEY` based on the `render.yaml`.

4.  **Manual Steps After Initial Deployment (on Render):**
    *   **Run Migrations:** After the initial deployment, you might need to manually run migrations on your Render database if they don't run automatically. You can do this via the Render shell for your web service:
        ```bash
        python manage.py migrate
        ```
    *   **Create Superuser:** Create an admin user for your deployed application:
        ```bash
        python manage.py createsuperuser
        ```

## Usage

- Navigate to the homepage to explore the portfolio.
- Browse the projects section to see detailed descriptions of various works.
- Read blog posts for insights and articles.
- Check out the courses section for educational background.
- Access the admin panel at `/admin/` to manage content (requires superuser credentials).

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
