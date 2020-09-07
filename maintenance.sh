#!/bin/bash

# say hello because it's polite
echo "hi! this is > lv-cli < 's mantenance script"

## available commands
publish(){
    
    while true; do

        if [[ `git status --porcelain` ]]; then
            echo "you do have local changes!"
            echo "will now rebuild, commit and publish."
        else
            echo "you don't have local changes. do you really need a new version?"
            echo "anyway, will now rebuild, commit (because of /lib) and publish."
        fi
        
        read -p "it's that okay (y/n)? " yn; echo "--"

        case $yn in
            [Yy]* ) 

                echo "publishing a new npm version. what's the commit message?"
                read commit_message; echo "--"

                rebuild
                git add .
                git commit --allow-empty -m "$commit_message"

                yarn config set version-tag-prefix "v"
                yarn version --non-interactive --patch
                yarn publish --non-interactive
                
                echo "there you go!"

                break;;
            [Nn]* )
                echo "ok! bye."
                exit;;
            * ) 
                echo "Please answer yes or no."
        esac
    done
}

rebuild(){
    rm -rf ./lib
    tsc -p . && node .
}

dryrun(){
    echo "cleaning and rebuilding..."
    rebuild
    rm -rf /tmp/lv-dryrun-cli/

    echo "assuming that there's a project at /tmp/lv-dryrun..."
    node . verbose scan -i /tmp/lv-dryrun -o /tmp/lv-dryrun-cli/scan/structure.json
    node . verbose encode -i /tmp/lv-dryrun-cli/scan/structure.json -o /tmp/lv-dryrun-cli/encode
    node . log -i 'log dryrun foo' -o /tmp/lv-dryrun-cli/log/log.txt
    node . log -i 'log dryrun bar' -o /tmp/lv-dryrun-cli/log/log.txt
    
    open /tmp/lv-dryrun-cli/
}

## what should we do?

 while true; do

        echo "available options are:"
        echo "1) publish"
        echo "2) dryrun"
        read -p "choose one: " opt; echo "--"

        case $opt in
            1) publish; break;;
            2) dryrun; break;;
            * ) echo "ok! bye."; exit;;
        esac
done

