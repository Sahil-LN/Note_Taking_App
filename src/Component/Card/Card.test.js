import { render, screen } from "@testing-library/react";
import { useNotes } from "../Context/NotesContext";
import userEvent from "@testing-library/user-event";
import Card from "./Card";

// Mocking the Component
jest.mock("../Context/NotesContext", () => {
  return {
    useNotes: jest.fn(),
  };
});

// Data section
const data = {
  id: 1231232,
  title: "afasf",
  description: "sdafsafdafs",
};

describe("Testing inside component", () => {

  let mockOnDelete = jest.fn();
  let mockSetUpdateStatus = jest.fn();

  beforeEach(() => {

    jest.clearAllMocks();

    useNotes.mockReturnValue({
      onDelete: mockOnDelete,
      setUpdateStatus: mockSetUpdateStatus,
    });

  });

  test("Snapeshot testing", () => {
    const { container } = render(<Card key={data.id} data={data} />);
    expect(container).toMatchSnapshot();
  });

  test("Testing whether the component rendering on the screen or not", () => {
    render(<Card key={data.id} data={data} />);
    const para = screen.getByText(/Title/i);

    expect(para).toHaveTextContent("Title : afasf");
  });

  test("testing on click event on the Paragraph Title Update is Trigered or not", async () => {
    const user = userEvent.setup();
    const {component} =render(<Card key={data.id} data={data} />);
    console.log(component);

    const para = screen.getByText(/Title/i);
    await user.click(para);

    expect(mockSetUpdateStatus).toHaveBeenCalled();
  });

  test("testing on click event on the Delete functions called or not", async () => {
    const user = userEvent.setup();
    const {component} =render(<Card key={data.id} data={data} />);
    console.log(component);

    const deleteButton = screen.getByTestId("delete");
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalled();
  });

});
