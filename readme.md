# Radio Wars
Drexel Wireless System Labs ([DWSL](https://wireless.ece.drexel.edu//)) 

Radio Wars: Competition Based Education for Wireless Network Security Using Software Defined Radios

The goal is to programatically determine the boundaries of the clathrin light chains in order to more easily visualize and analyze the images. [LeverJS](http://leverjs.net) is used to track the segmentated areas over time. This is my final project for Drexel's ECES 486 - Cell and Tissue Image Analysis class. A quick presentation can be found [here](https://docs.google.com/presentation/d/14cn0rTEpvzDUGAnEgptr60_lPP5YNSOcTdOhsISTSKY/edit?usp=sharing).

The goal of this repository is provide a user interface to the students taking part in the Radio Wars Senior Design sequence. It allows users to control all the software defined radios within the Drexel Wireless Systems Lab using simple knobs and switches, and to see the effects of those changes in each game mode. Game modes include:

1) Interference and Power Management
2) Encrpytion
3) Spoofind and Authentication


## Running Locally

- clone the repository `git clone https://github.com/wplucinsky/RadioWars` 
- from within the RadioWars directory, run `python -m SimpleHTTPServer`
- in a web browser, go to `http://localhost:8000/` 
-- open `login.html` for the login screen (not necessary when running locally)
-- open `index.html` for player view
-- open `viewer.html` for a simplified monitor view

## Running Entire Radio Wars Stack

- ssh into the DWSL's grid server, `ssh loganserver@dwslgrid.ece.drexel.edu`
- navigate to the GridView, cd `cd GridView`
- clone or pull in the RadioWars directory
-- `git clone https://github.com/wplucinsky/RadioWars`
-- `cd RadioWars`, `git pull`
- from the GridView folder, create docker container `docker-compose build`
-- if the python requirements can't be downloaded, the docker service must be restarted by the server admin
- run docker container `docker-compose up`
- navigate to `http://dwslgrid.ece.drexel.edu:5000/`
- login and you'll be automatically directed, based on your username, to the correct view

## Development
- 