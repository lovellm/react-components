import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import Dropdown, { DropdownOptions, DropdownProps } from "./Dropdown";

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  title: "Dropdown",
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof Dropdown>;

const options: DropdownOptions[] = [
  { value: "test1", label: "First Test Value" },
  { value: "test2", label: "Second Test Value" },
  { value: "test3", label: "Test Value Number 3" },
  { value: "test4", label: "And a Fourth" },
];

const DropdownWrapper = (args: Partial<DropdownProps>) => {
  const [value, setValue] = useState<string | undefined>(args?.value);
  return <Dropdown {...args} value={value} onSelect={setValue} />;
};
export const SimpleDropdown: Story = {
  args: {
    options: options,
    value: "test3",
  },
  render: (args) => <DropdownWrapper {...args} />,
};
