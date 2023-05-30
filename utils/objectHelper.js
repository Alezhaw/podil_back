class ObjectHelper {
    constructor() {
    }

    static getObjectDifferences(obj1, obj2) {
        const differences = [];

        for (let key in obj1) {
            if (!(/^\d+$/.test(obj1[key]?.toString()))) {
                try {
                    let date = new Date(obj1[key]?.toString());

                    if (date !== "Invalid Date" && !isNaN(date)) {
                        if (!obj2.hasOwnProperty(key) || date.toISOString() != new Date(obj2[key])?.toISOString()) {
                            differences.push([key, date.toISOString(), new Date(obj2[key])?.toISOString()]);
                        }
                        continue;
                    }
                } catch (err) {
                    console.log(err);
                }
            }

            if (!obj2.hasOwnProperty(key) || obj1[key]?.toString() != obj2[key]?.toString()) {
                differences.push([key, obj1[key]?.toString(), obj2[key]?.toString()]);
            }
        }

        return differences;
    }
}

module.exports = ObjectHelper;