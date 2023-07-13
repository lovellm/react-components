import { useState, useRef } from "react";
import { Meta, StoryObj } from "@storybook/react";
import PageMessage from "./PageMessage";

const meta: Meta<typeof PageMessage> = {
  component: PageMessage,
  title: "PageMessage",
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof PageMessage>;
export const BasicMessage: Story = {
  args: {
    message: "Hello, this is a message",
    onClose: undefined,
  },
};

export const LoadingMessage: Story = {
  args: {
    message: "Something is Loading",
    isLoading: true,
    onClose: undefined,
  },
};

export const ErrorMessage: Story = {
  args: {
    message: "An Error Occurred",
    error: new Error("Test Error Message"),
    actionText: "Retry",
  },
};

export const MultipleMessages: Story = {
  render: (args) => (
    <div>
      <PageMessage {...args} />
      <PageMessage {...args} />
    </div>
  ),
  args: {
    message: "Testing",
    onClose: undefined,
  },
};

const AddRemoveMessage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const count = useRef(0);
  const addMessage = () => {
    count.current += 1;
    setMessages([
      ...messages,
      "Message " + count.current + " created at " + new Date().toISOString(),
    ]);
  };

  return (
    <div>
      <div>
        <button className="border border-black p-2 bg-slate-200" onClick={addMessage}>
          Add a new Message
        </button>
      </div>
      {messages.map((message, i) => (
        <PageMessage
          key={i}
          message={message}
          onClose={() => {
            const nextMessages = messages.filter((m) => m !== message);
            setMessages(nextMessages);
          }}
        />
      ))}
    </div>
  );
};
export const AddRemove: Story = {
  render: () => <AddRemoveMessage />,
};
