"use client";
import React, { useState, useEffect } from "react";
import { NumberPi } from "@/components/ui/pi-nums";
import { RankListCard } from "@/components/charts/rank-list-card";
import { Card, AreaChart, Title, Text } from "@tremor/react";

export default function AnalysisPage({ params }) {
  const [analysisResults, setAnalysisResults] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_HOST}/analysis/${params.analysisId}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch analysis results, status: ${response.status}`
          );
        }

        const data = await response.json();
        setAnalysisResults(data);
      } catch (error) {
        console.error("error", error);
        setErrorMessage("Failed to load analysis results.");
      }
    }

    fetchData();
  }, [params.analysisId]); // Dependency array, re-run effect if analysisId changes

  // Error message display
  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  }

  // Ensure data is loaded
  if (!analysisResults.data) {
    return <div>Loading...</div>;
  }
  const author_list = analysisResults.data.author_list;
  const authorOne = author_list[0];
  const authorTwo = author_list[1];
  const domains = analysisResults.data.favorite_domains_per_author;
  const authorOneDomains = domains[authorOne].common_domains.map((item) => ({
    name: item[0],
    value: item[1],
  }));
  const authorTwoDomains = domains[authorTwo].common_domains.map((item) => ({
    name: item[0],
    value: item[1],
  }));
  const authorOneTotalDomains = domains[authorOne].total_count;
  const authorTwoTotalDomains = domains[authorTwo].total_count;

  const emojis = analysisResults.data.most_used_emojis_per_author;
  const authorOneEmojis = emojis[authorOne].common_emojis.map((item) => ({
    name: item[0],
    value: item[1],
  }));
  const authorTwoEmojis = emojis[authorTwo].common_emojis.map((item) => ({
    name: item[0],
    value: item[1],
  }));
  const authorOneEmojisTotal = emojis[authorOne].total_count;
  const authorTwoEmojisTotal = emojis[authorTwo].total_count;

  const words = analysisResults.data.most_used_words_per_author;
  const authorOneWords = words[authorOne].common_words.map((item) => ({
    name: item[0],
    value: item[1],
  }));
  const authorTwoWords = words[authorTwo].common_words.map((item) => ({
    name: item[0],
    value: item[1],
  }));
  const authorOneWordsTotal = words[authorOne].total_count;
  const authorTwoWordsTotal = words[authorTwo].total_count;

  const attachments = analysisResults.data.attachments_count;
  const attach_pv1 =
    Math.round(
      (attachments[authorOne] /
        (attachments[authorTwo] + attachments[authorOne])) *
        1000
    ) / 10;
  const attach_pv2 =
    Math.round(
      (attachments[authorTwo] /
        (attachments[authorTwo] + attachments[authorOne])) *
        1000
    ) / 10;
  const attach_iv1 = attach_pv1 + "%";
  const attach_iv2 = attach_pv2 + "%";
  const attach_oh1 =
    attachments[authorOne] +
    "/" +
    (attachments[authorTwo] + attachments[authorOne]) +
    "(" +
    attach_iv1 +
    ")";
  const attach_oh2 =
    attachments[authorTwo] +
    "/" +
    (attachments[authorTwo] + attachments[authorOne]) +
    "(" +
    attach_iv2 +
    ")";
  const attach_hh1 = "Attachments shared by " + authorOne;
  const attach_hh2 = "Attachments shared by " + authorTwo;

  const initiations = analysisResults.data.conversation_initiators;
  const init_pv1 =
    Math.round(
      (initiations[authorOne] /
        (initiations[authorTwo] + initiations[authorOne])) *
        1000
    ) / 10;
  const init_pv2 =
    Math.round(
      (initiations[authorTwo] /
        (initiations[authorTwo] + initiations[authorOne])) *
        1000
    ) / 10;
  const init_iv1 = init_pv1 + "%";
  const init_iv2 = init_pv2 + "%";
  const init_oh1 =
    initiations[authorOne] +
    "/" +
    (initiations[authorTwo] + initiations[authorOne]) +
    "(" +
    init_iv1 +
    ")";
  const init_oh2 =
    initiations[authorTwo] +
    "/" +
    (initiations[authorTwo] + initiations[authorOne]) +
    "(" +
    init_iv2 +
    ")";
  const init_hh1 = "Conversastions initiated by " + authorOne;
  const init_hh2 = "Conversastions initiated by " + authorTwo;

  const messageCount = analysisResults.data.total_message_count_per_author;
  const msgcnt_pv1 =
    Math.round(
      (messageCount[authorOne] /
        (messageCount[authorTwo] + messageCount[authorOne])) *
        1000
    ) / 10;
  const msgcnt_pv2 =
    Math.round(
      (messageCount[authorTwo] /
        (messageCount[authorTwo] + messageCount[authorOne])) *
        1000
    ) / 10;
  const msgcnt_iv1 = msgcnt_pv1 + "%";
  const msgcnt_iv2 = msgcnt_pv2 + "%";
  const msgcnt_oh1 =
    messageCount[authorOne] +
    "/" +
    (messageCount[authorTwo] + messageCount[authorOne]) +
    "(" +
    msgcnt_iv1 +
    ")";
  const msgcnt_oh2 =
    messageCount[authorTwo] +
    "/" +
    (messageCount[authorTwo] + messageCount[authorOne]) +
    "(" +
    msgcnt_iv2 +
    ")";
  const msgcnt_hh1 = "Messages sent by " + authorOne;
  const msgcnt_hh2 = "Messages sent by " + authorTwo;

  function convertActivityFormat(activityPerHour) {
    const authors = Object.keys(activityPerHour);
    const data = [];

    for (let hour = 0; hour < 24; hour++) {
        let hourObj = { hour };

        authors.forEach((author, index) => {
            // Dynamically create author keys based on their index
            hourObj[author] = activityPerHour[author][hour.toString()] || 0;
        });

        data.push(hourObj);
    }
    console.log(data);
    return data;
}

  const chartData = convertActivityFormat(analysisResults.data.activity_per_hour)

  // Component's main render output
  return (
    <div className="container mx-auto px-4">
      {/* {JSON.stringify(analysisResults)} */}
      <h1 className="text-lg font-bold mx-4 my-4">Chat insights for:</h1>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-4 text-3xl my-4">
        <div>
          <h2 className="text-center font-bold mb-4">{authorOne}</h2>
        </div>
        <div>
          <h2 className="text-center font-bold mb-4 text-lg">and</h2>
        </div>
        <div>
          <h2 className="text-center font-bold mb-4">{authorTwo}</h2>
        </div>
      </div>
      <h1 className="text-2xl font-bold mx-4 my-4">Story in Numbers</h1>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        <NumberPi
          progeressValue={msgcnt_pv1}
          innerText={msgcnt_iv1}
          outerHead={msgcnt_oh1}
          hintText={msgcnt_hh1}
        />
        <NumberPi
          progeressValue={msgcnt_pv2}
          innerText={msgcnt_iv2}
          outerHead={msgcnt_oh2}
          hintText={msgcnt_hh2}
        />
        <NumberPi
          progeressValue={attach_pv1}
          innerText={attach_iv1}
          outerHead={attach_oh1}
          hintText={attach_hh1}
        />
        <NumberPi
          progeressValue={attach_pv2}
          innerText={attach_iv2}
          outerHead={attach_oh2}
          hintText={attach_hh2}
        />
        <NumberPi
          progeressValue={init_pv1}
          innerText={init_iv1}
          outerHead={init_oh1}
          hintText={init_hh1}
        />
        <NumberPi
          progeressValue={init_pv2}
          innerText={init_iv2}
          outerHead={init_oh2}
          hintText={init_hh2}
        />
      </div>

      <h1 className="text-2xl font-bold mx-4 my-4">
        Average Messages per hour
      </h1>
      <div className="mx-8 mt-2 mb-2">
        <Card className="mt-8">
          <Title>Hour wise message</Title>
          <Text>Average message count per hour</Text>
          <AreaChart
            className="mt-4 h-80"
            data={chartData}
            categories={[authorOne, authorTwo]}
            index="hour"
            colors={["indigo", "yellow"]}
            valueFormatter={(number) =>
              `${Intl.NumberFormat("us").format(number).toString()}`
            }

            yAxisWidth={60}
          />
        </Card>
      </div>

      <h1 className="text-2xl font-bold mx-4 my-4">Favourite Domains</h1>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mx-8 mt-2 mb-2">
        <RankListCard
          title="Links"
          total={authorOneTotalDomains}
          description={"shared by " + authorOne}
          nameHead={"Website"}
          valueHead={"count"}
          list={authorOneDomains}
        />
        <RankListCard
          title="Links"
          total={authorTwoTotalDomains}
          description={"shared by " + authorTwo}
          nameHead={"Website"}
          valueHead={"count"}
          list={authorTwoDomains}
        />
      </div>

      <h1 className="text-2xl font-bold mx-4 my-4">Favourite Emoji</h1>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mx-8 mt-2 mb-2">
        <RankListCard
          title="Emojis"
          total={authorOneEmojisTotal}
          description={"used by " + authorOne}
          nameHead={"Emoji"}
          valueHead={"count"}
          list={authorOneEmojis}
        />
        <RankListCard
          title="Emojis"
          total={authorTwoEmojisTotal}
          description={"used by " + authorTwo}
          nameHead={"Emoji"}
          valueHead={"count"}
          list={authorTwoEmojis}
        />
      </div>

      <h1 className="text-2xl font-bold mx-4 my-4">Most used words</h1>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mx-8 mt-2 mb-2">
        <RankListCard
          title="Words"
          total={authorOneWordsTotal}
          description={"written by " + authorOne}
          nameHead={"Word"}
          valueHead={"count"}
          list={authorOneWords}
        />
        <RankListCard
          title="Words"
          total={authorTwoWordsTotal}
          description={"written by " + authorTwo}
          nameHead={"Word"}
          valueHead={"count"}
          list={authorTwoWords}
        />
      </div>
    </div>
  );
}
