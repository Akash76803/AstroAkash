import { swissEphemerisService } from "../services/swissEphemerisService.js";

async function main() {
  const sampleInput = {
    name: "Akash",
    date: "1995-10-15",
    time: "14:30:00",
    location: {
      name: "Mumbai, India",
      latitude: 19.076,
      longitude: 72.8777,
      timezone: "Asia/Kolkata"
    }
  };

  const result = await swissEphemerisService.generateBirthChart(sampleInput);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error("Sample chart generation failed:", error);
  process.exit(1);
});
