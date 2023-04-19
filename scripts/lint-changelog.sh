#!/bin/bash

# raw_input='These are demo release notes for human changelog\n\nnew features:\n- new fun 🥳\n- other feat 🥳\n\nbreaking changes:\n- more stuff 🤯\n\nfixes:\n- no bugs 😇\n\n'
input="These are demo release notes for human changelog\n\nnew features:\n- new fun 🥳\n- other feat 🥳\n\nbreaking changes:\n- more stuff 🤯\n\nfixes:\n- no bugs 😇\n\n"


function get_lines() {
    local raw_input="$1"

    mapfile -t lines < <( echo $raw_input | awk -F'\\\\n' '{for(i=1; i<=NF; i++) print $i}' )
}

function check_block() {
    local block_name="$1"
    local block_found=false
    local items_amount=0

    for i in "${!lines[@]}"
        do
            if [[ "${lines[$i]}" == "$block_name"* ]]; then
                # echo "found at line $i: ${lines[$i]}"
                block_found=true

            elif [[ "$block_found" == true && "${lines[$i]}" =~ ^-.* ]]; then

                items_amount=$(expr $items_amount + 1)
                # echo "  item $items_amount : ${lines[$i]}"

            elif [[ "$block_found" == true ]]; then
                break
            fi
        done


    if [[ "$block_found" == false ]]; then
        echo "Block not found: $block_name"
        exit 1
    elif [[ "$block_found" == true && "$items_amount" == 0 ]]; then
        # how to: "if items_amount == 0; set line 'no items for $block_name' "
        echo "No items for $block_name"
        exit 1
    fi
}

function linter() {
    local raw_input=$1

    lines=()

    get_lines "$raw_input"

    check_block  "new features:"
    check_block  "fixes:"
    check_block  "breaking changes:"


    # for i in "${!lines[@]}"
    # do
    #     echo "$i: ${lines[$i]}"
    # done

    # echo "$raw_input"
}

# linter "$input"
linter "$1"


