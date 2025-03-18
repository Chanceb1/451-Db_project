
# Sprint 1 Report

## Video Link:

[WSU CPTS451 Sprint 1 Group Video - YouTube](https://youtu.be/eP287qLI-oY)

## What's New (User Facing)

- User authentication system with login functionality

- Admin login with dedicated dashboard access

- Prototype UI with basic layout and navigation

- PostgreSQL database schema with normalized tables

## Work Summary (Developer Facing)

In this initial sprint, our team focused on establishing the foundation for our full-stack job listing application. We successfully created a prototype UI that visualizes the application's layout and user flow, while simultaneously setting up the backend database structure with properly normalized PostgreSQL tables. The team implemented user and admin authentication systems, allowing for differentiated access to the platform. We encountered some challenges with database implementation that prevented us from completing the PostgreSQL instantiation, but we made significant progress in designing the table structures needed for our application. The authentication features were completed ahead of schedule, creating a solid foundation for future development.

## Unfinished Work

We were unable to complete three planned issues during this sprint:

1. Instantiate PostgreSQL Database (#3): While we completed the database schema and normalization, we ran out of time to fully instantiate the database. The current status includes completed design work, but we still need to implement the database creation scripts and verify connectivity with default credentials.  

2. Integrate Prototype UI with Application (#7): We completed the prototype UI design but didn't have sufficient time to convert these designs into React components. This task has been moved to Sprint 2.  

3. Add Routing for Frontend Features (#8): This task was dependent on the UI integration, so it has also been moved to Sprint 2.  

## Completed Issues/User Stories

Here are links to the issues that we completed in this sprint:

- [User Login #1https://github.com/Chanceb1/451-Db_project/issues/1

- [Admin Login #2]https://github.com/Chanceb1/451-Db_project/issues/2

- [Create Prototype UI #4]https://github.com/Chanceb1/451-Db_project/issues/4

- [Create PostgreSQL Table Designs #5]https://github.com/Chanceb1/451-Db_project/issues/5

- [Normalize Tables #6]https://github.com/Chanceb1/451-Db_project/issues/6

## Incomplete Issues/User Stories

Here are links to issues we worked on but did not complete in this sprint:

- [Instantiate PostgreSQL Database #3](URL of issue 3) - We completed the database schema design but ran out of time to implement the instantiation scripts.

- [Integrate Prototype UI with Application #7](URL of issue 7) - We did not get to this issue because it was dependent on the prototype UI completion, which was finished later in the sprint than anticipated.

- [Add Routing for Frontend Features #8](URL of issue 8) - We did not get to this issue because it was dependent on the UI integration.

## Code Files for Review

Please review the following code files, which were actively developed during this sprint, for quality:

- database/schema.prisma

- [auth utils]backend\app\core\security.py

- [login routes]backend\app\api\routes\login.py

## Retrospective Summary

### Here's what went well:

- Authentication system implementation was completed efficiently

- The prototype UI design received positive feedback

- Team collaboration on database schema design was effective

- Clear division of responsibilities led to parallel work streams

### Here's what we'd like to improve:

- Better time estimation for database-related tasks

- More frequent check-ins on interdependent tasks

- Earlier integration testing between frontend and backend components

- More detailed acceptance criteria for UI-related tasks

### Here are changes we plan to implement in the next sprint:

- Set up regular database implementation sync meetings

- Create a shared development environment for faster integration testing

- Implement a task dependency tracking system to better visualize blockers

- Allocate more resources to UI integration tasks to catch up on our schedule