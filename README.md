# PlugNMeet recording to Opencast ingester

A simple script that automatically uploads [PlugNMeet](https://github.com/mynaparrot/plugNmeet-server) recordings into Opencast

# Installation from source:
1. Open **post_processing_scripts** location in your PlugNMeet recorder installation
2. In this directory, using git clone this repository 
```
git clone https://github.com/Lyx52/plugNmeet-opencast-ingester.git
```
3. Install required dependencies
```
cd plugNmeet-opencast-ingester && npm install
```
4. Build the project
   * On linux
   ```
   npm run build:linux
   ```
   * On windows
   ```
   npm run build:win
   ```
5. Create a copy of config_sample.yaml (The config.yaml file needs to be next to final build output files index.js etc..)
   * On linux
   ```
   cp config_sample.yaml ./dist/config.yaml
   ```
    * On windows
   ```
   copy config_sample.yaml .\dist\config.yaml
   ```
6. Edit config.yaml according to your needs minimum required is plugnmeet and opencast auth information
7. Edit config.yaml located in your PlugNMeet recorder installation, in **post_processing_scripts** configuration add this line:

```
"./post_processing_scripts/plugNmeet-opencast-ingester/dist/index.js"
```
*If your installation is located elsewhere you will need to change this accordingly*
