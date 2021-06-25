class Main {
    static load() {
        Main.senators = [];
        fetch("https://api.propublica.org/congress/v1/115/senate/members.json", {
            method: "GET",
            headers: {
                "X-API-KEY": "LZQ5kk9w5bQ9bcvGD1A0dNQX9QgAIAVtb86N1v0V"
            }
        }).then(results =>  {
            return results.json();
        }).then((data) => {
            Main.createList(data.results[0].members);
        }).catch(error => alert(error.message));

        document.getElementById("search-bar").addEventListener("input", function(event) {

            const value = this.value.toUpperCase();
            var fuse = new Fuse(Main.senators, {
                shouldSort: true,
                includeMatches: true,
                tokenize:true,
                threshold: .1,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [
                  "data.first_name",
                  "data.last_Name",
                  "data.state"
              ]});

            var matches = fuse.search(value.toUpperCase());

            if(value != "") {
                Main.senators.forEach((senator, index) => {
                    senator.listItem.hidden = true;
                })
                matches.forEach(match => {
                    match.item.listItem.hidden = false;
                })
            } else {
                Main.senators.forEach((senator, index) => {
                    senator.listItem.hidden = false;
                })
            }
        }) 
    }

    static createList(data) {
        const senators = Main.senators;
        data.sort(function(a, b) {
            return (function() {
                if(a["state"] > b["state"]) return  1;
                else if (a["state"] < b["state"]) return -1;
                else return 0;
            })()
        })
        data.forEach(senator => {
            if(senator["in_office"] === false) return;
            var listItem = document.createElement('div');
            const party = (function() {
                switch(senator['party']) {
                    case 'R':
                        return "republican";
                    case 'D':
                        return "democrat";
                    default:
                        return "other";
                }
            })();
            listItem.className = "list-item" + " " + party;
            Main.addImage(listItem, senator.id);
            const parent = document.getElementById("senator-list");
            parent.appendChild(listItem);
            listItem.addEventListener("click", function(event) {
                if(event.target !== event.currentTarget) {
                    return;
                }
                open(senator.url, "_blank");
                // const fade = document.createElement('div');
                // const popup = Main.createPopup(senator);
                // fade.id = 'fade';
                // // document.body.appendChild(popup);
                // // document.body.appendChild(fade);
                // fade.addEventListener("click", function(event) {
                // //     popup.remove();
                // //    fade.remove();
                    
                // })
            })
            listItem.appendChild(Main.addNames(listItem, senator));
            senators.push({"data": senator, "listItem": listItem});
            
         });
    }

    static addImage(listItem, id) {
        let image = new Image(90, 110);
        image.onload = () => {
            listItem.appendChild(image);
        };
        image.src = `https://theunitedstates.io/images/congress/225x275/${id}.jpg`; 
    }

    static addNames(listItem, senator) {
        const info = document.createElement('div');
        info.className = "info";
        const nameElement = document.createElement('p');
        nameElement.className = "name";
        const stateElement = document.createElement('p');
        stateElement.className = "state";
        const emailElement = document.createElement('a');
        emailElement.className = "email";
        const phoneElement = document.createElement(senator['phone'] ? 'a' : 'p');
        phoneElement.className = "phone";
        nameElement.innerHTML = senator["first_name"] + ` ` + senator["last_name"];
        stateElement.innerHTML = senator["state"] = (function() {
            switch (senator["state"]) {
                case "AL":
                    return "Alabama";
                case "AK":
                    return "Alaska";
                case "AZ":
                    return "Arizona";
                case "AR":
                    return "Arkansas";
                case "CA":
                    return "California";
                case "CO":
                    return "Colorado";
                case "CT":
                    return "Connecticut";
                case "DE":
                    return "Delaware";
                case "FL":
                    return "Florida";
                case "GA":
                    return "Georgia";
                case "HI":
                    return "Hawaii";
                case "ID":
                    return "Idaho";
                case "IL":
                    return "Illinois";
                case "IN":
                    return "Indiana";
                case "IA":
                    return "Iowa";
                case "KS":
                    return "Kansas";
                case "KY":
                    return "Kentucky";
                case "LA":
                    return "Louisiana";
                case "ME":
                    return "Maine";
                case "MD":
                    return "Maryland";
                case "MA":
                    return "Massachusetts";
                case "MI":
                    return "Michigan";
                case "MN":
                    return "Minnesota";
                case "MS":
                    return "Mississippi";
                case "MO":
                    return "Missouri";
                case "MT":
                    return "Montana";
                case "NE":
                    return "Nebraska";
                case "NV":
                    return "Nevada";
                case "NH":
                    return "New Hampshire";
                case "NJ":
                    return "New Jersey";
                case "NM":
                    return "New Mexico";
                case "NY":
                    return "New York";
                case "NC":
                    return "North Carolina";
                case "ND":
                    return "North Dakota";
                case "OH":
                    return "Ohio";
                case "OK":
                    return "Oklahoma";
                case "OR":
                    return "Oregon";
                case "PA":
                    return "Pennsylvania";
                case "RI":
                    return "Rhode Island";
                case "SC":
                    return "South Carolina";
                case "SD":
                    return "South Dakota";
                case "TN":
                    return "Tennessee";
                case "TX":
                    return "Texas";
                case "UT":
                    return "Utah";
                case "VT":
                    return "Vermont";
                case "WA":
                    return "Washington";
                case "WV":
                    return "West Virginia";
                case "VA":
                    return "Virginia";
                case "WI":
                    return "Wisconsin";
                case "WY":
                    return "Wyoming";
            }
        })()
        emailElement.innerHTML = "Email";
        phoneElement.innerHTML = senator["phone"] || "No phone number available.";
        phoneElement.href = senator["phone"] ? "tel:" + senator["phone"].replace(/[^0-9]/g, ""): "";
        emailElement.href = senator["contact_form"];
        emailElement.target = "_blank";
        info.appendChild(nameElement);
        info.appendChild(stateElement);
        info.appendChild(emailElement);
        info.appendChild(phoneElement);
        return info;
    }

    static fuzzySearch(str, pattern){
        pattern = pattern.split("").reduce(function(a,b){ return a+".*"+b; });
        return (new RegExp(pattern)).test(str);
    }

    static createPopup(senator) {
        const popup = document.createElement('div');
        popup.id = "popup";
        popup.className = (function() {
            switch(senator['party']) {
                case 'R':
                    return "republican";
                case 'D':
                    return "democrat";
                default:
                    return "other";
            }
        })();
        return popup;
    }
}