var CronJob = require("cron").CronJob;
const axios = require("axios");
var _ = require("underscore");

var job = new CronJob(
  "*/10 * * * *",
  function () {
    console.log("You will see this message every second");
    axios
      .get("http://localhost:1026/v2/entities")
      .then((response) => {
        var data = response.data;
        var resin = _.where(data, { type: "Resin" });
        resin.forEach((r) => {
          if (r.resin.value !== 160) {
            var aux = 10;
            if (r.resin.value > 150) {
              aux = 160 - r.resin.value;
            }
            axios.post("http://localhost:1026/v2/entities/" + r.id + "/attrs", {
              resin: {
                type: "Number",
                value: r.resin.value + aux,
              },
              modified: {
                type: "Boolean",
                value: false,
              },
            });
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },
  null,
  true,
  "America/Los_Angeles"
);
job.start();
