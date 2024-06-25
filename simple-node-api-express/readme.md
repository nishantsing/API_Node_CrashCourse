- create script in package.json  
  npx nodemon src/app.js for using nodemon without installing it as dev or normal dependency in your project.

- toptal nodejs gitignore - gives u all imp files for gitignore

\*git basic commands
git init
git status
git add .
git commit -m "<msg>"
git push

- mongodb Atlas for cloud database
  Create a new cluster(database) Name the cluster to database name, use shared for free
  create users and use local Environment for dev and testing purpose, ip address(0.0.0.0/0)
  After creating click on connect - connect your application.

  In mongoose url string add the name u want to give to ur collection after / and before ?
  and to change the name of inside collection change it while doing mongoose.model('some_name',schemaName)
