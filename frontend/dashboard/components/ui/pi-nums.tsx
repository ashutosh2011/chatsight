import { Card, ProgressCircle } from "@tremor/react";

export function NumberPi({
  progeressValue,
  innerText,
  outerHead,
  hintText,
}: any) {
  return (
    <Card className="mx-auto max-w-sm">
      <div className="flex justify-start space-x-5 items-center">
        <ProgressCircle value={progeressValue} size="md">
          <span className="text-xs font-medium text-slate-700">
            {innerText}
          </span>
        </ProgressCircle>
        <div>
          <p className="text-tremor-default text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
            {outerHead}
          </p>
          <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            {hintText}
          </p>
        </div>
      </div>
    </Card>
  );
}
