import { Meta, StoryObj } from "@storybook/react";
import PreventCopy from "./PreventCopy";

const meta: Meta<typeof PreventCopy> = {
  component: PreventCopy,
  title: "PreventCopy",
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof PreventCopy>;
export const NoCopyWithExecption: Story = {
  args: {
    className: "no-copy",
    allow: "allow-copy",
  },
  render: (args) => (
    <div>
      <div className="no-copy m-1 bg-rose-100 p-1">
        <div>This text can not be copied</div>
        <table>
          <tbody>
            <tr>
              <td>Data</td>
              <td>In a</td>
              <td>table</td>
            </tr>
            <tr>
              <td>Data</td>
              <td>In a</td>
              <td>table</td>
            </tr>
          </tbody>
        </table>
        <div>More text that can not be copied</div>
        <div className="allow-copy bg-emerald-100 p-1">But this text can be copied</div>
        <div>But not this</div>
      </div>
      <div className="m-1 bg-teal-100 p-1">
        This text is outside the blocked class and can be copied
      </div>
      <PreventCopy {...args} />
    </div>
  ),
};
