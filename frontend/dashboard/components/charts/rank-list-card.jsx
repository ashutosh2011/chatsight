import { Card, Metric, Text, Title, BarList, Flex } from "@tremor/react";

export function RankListCard({ title, total, nameHead, valueHead, list, description }) {
  return (
    <Card>
      <Title>{title}</Title>
      <Flex justifyContent="start" alignItems="baseline" className="space-x-2">
        <Metric>{total}</Metric>
        <Text>{description}</Text>
      </Flex>
      <Flex className="mt-6">
        <Text>{nameHead}</Text>
        <Text className="text-right">{valueHead}</Text>
      </Flex>
      <BarList
        data={list}
        valueFormatter={(number) =>
          Intl.NumberFormat("us").format(number).toString()
        }
        className="mt-2"
      />
    </Card>
  );
}
