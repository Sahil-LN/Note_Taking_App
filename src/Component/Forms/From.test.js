import {
    render,
    screen,
} from "@testing-library/react";
import { useNotes } from "../Context/NotesContext";
import userEvent from "@testing-library/user-event";
import Form from "./Form";


// Mocking the Component
jest.mock("../Context/NotesContext", () => {
    return {
        useNotes: jest.fn(),
    };
});

let mockOnAdd = jest.fn();
let mockOnUpdate = jest.fn();
let mockSetUpdateStatus = jest.fn();
const mockAlert = jest.fn();
global.alert = mockAlert;

describe("Testing rendering of the Component snapshot", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useNotes.mockReturnValue({
            onAdd: mockOnAdd,
            onUpdate: mockOnUpdate,
            setUpdateStatus: mockSetUpdateStatus,
            update: {
                update: false,
            },
        });
    });

    test("Testing Snapshot", () => {
        const { container } = render(<Form />);
        expect(container).toMatchSnapshot();
    });

    test("Testing whether component is rendering properly or not", () => {
        render(<Form />);
        const component = screen.getByText("Add Note");
        expect(component).toBeInTheDocument();
    });
});

describe("no data input alert should called and onAdd should not be called", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useNotes.mockReturnValue({
            onAdd: mockOnAdd,
            onUpdate: mockOnUpdate,
            setUpdateStatus: mockSetUpdateStatus,
            update: {
                update: false,
            },
        });
    });

    test("Testing alert should be for title called and onAdd should not be called", async () => {
        const user = userEvent.setup();
        render(<Form />);

        const titleInput = screen.getByTestId("title");
        const descriptionInput = screen.getByTestId("description");
        const addButton = screen.getByText("Add Note");

        await user.type(titleInput, " ");
        await user.type(descriptionInput, "fasfsa");
        await user.click(addButton);

        expect(mockAlert).toBeCalledTimes(1);
        expect(mockOnAdd).not.toHaveBeenCalled();
    });

    test("Testing alert should be for description called and onAdd should not be called", async () => {
        const user = userEvent.setup();
        render(<Form />);

        const titleInput = screen.getByTestId("title");
        const descriptionInput = screen.getByTestId("description");
        const addButton = screen.getByText("Add Note");

        await user.type(titleInput, "afssafd");
        await user.type(descriptionInput, " ");
        await user.click(addButton);
        expect(mockAlert).toBeCalledTimes(1);

        expect(mockOnAdd).not.toHaveBeenCalled();
    });
});

describe("Testing Add note", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useNotes.mockReturnValue({
            onAdd: mockOnAdd,
            onUpdate: mockOnUpdate,
            setUpdateStatus: mockSetUpdateStatus,
            update: {
                update: false,
            },
        });
    });

    test("Testing whether onAdd function called", async () => {
        const user = userEvent.setup();
        render(<Form />);

        const titleInput = screen.getByTestId("title");
        const descriptionInput = screen.getByTestId("description");
        const addButton = screen.getByText("Add Note");

        await user.type(titleInput, "fasfsa");
        await user.type(descriptionInput, "fasfsa");
        await user.click(addButton);

        expect(mockOnAdd).toHaveBeenCalled();
    });

    test("same Title is Entering or storing (alert should be called in noteContext page) and data should not be reset", async () => {
        const user = userEvent.setup();

        const mockOnAdd = jest.fn(() => false);

        useNotes.mockReturnValue({
            onAdd: mockOnAdd,
            update: {
                update: false,
            },
        });

        render(<Form />);

        const titleInput = screen.getByTestId("title");
        const descriptionInput = screen.getByTestId("description");
        const addButton = screen.getByText("Add Note");

        await user.type(titleInput, "fasfsa");
        await user.type(descriptionInput, "fasfsa");
        await user.click(addButton);

        expect(titleInput.value).toEqual("fasfsa");
    });
});

describe("Testing update note", () => {
    // Empty input filed is checked in add note test which is same here in same the function we use onAdd
    // if update is arrived then only onNpdate function otherwise it calles the add note
    //

    beforeEach(() => {
        jest.clearAllMocks();

        useNotes.mockReturnValue({
            onAdd: mockOnAdd,
            onUpdate: mockOnUpdate,
            setUpdateStatus: mockSetUpdateStatus,
            update: {
                update: true,
                id: 2323124,
                title: "abc",
                description: "abcd",
            },
        });
    });

    test("on update set checking the data to be set to input fields", async () => {
        const user = userEvent.setup();
        render(<Form />);

        const titleInput = screen.getByTestId("title");
        const descriptionInput = screen.getByTestId("description");
        // const updateButton = await screen.findByText("Update Note");

        // await user.type(titleInput, "fasfsa");
        // await user.type(descriptionInput, "fasfsa");
        // await user.click(updateButton);

        expect(titleInput.value).toEqual("abc");
        expect(descriptionInput.value).toEqual("abcd");
    });


    test("If duplicate Title try to set data should not reset", async () => {

        const mockOnUpdate = jest.fn(() => false);

        useNotes.mockReturnValue({
            onAdd: mockOnAdd,
            onUpdate: mockOnUpdate,
            setUpdateStatus: mockSetUpdateStatus,
            update: {
                update: true,
                id: 2323124,
                title: "abc",
                description: "abcd",
            },
        });

        const user = userEvent.setup();
        render(<Form />);

        const updateButton = await screen.findByText("Update Note");

        await user.click(updateButton);
        const titleInput = await screen.findByTestId("title");
        const descriptionInput = await screen.findByTestId("description");

        expect(mockOnUpdate).toBeCalled();
        expect(titleInput.value).toEqual("abc");
        expect(descriptionInput.value).toEqual("abcd");
    });



    test("on update arrivel after data set onUpdate function should be called and fields should reset after update", async () => {

        const mockOnUpdate = jest.fn(() => true);

        useNotes.mockReturnValue({
            onAdd: mockOnAdd,
            onUpdate: mockOnUpdate,
            setUpdateStatus: mockSetUpdateStatus,
            update: {
                update: true,
                id: 2323124,
                title: "abc",
                description: "abcd",
            },
        });
        const user = userEvent.setup();

        render(<Form />);

        const titleInput = screen.getByTestId("title");
        const descriptionInput = await screen.findByTestId("description");
        const updateButton = await screen.findByText("Update Note");

        await user.click(updateButton);

        expect(mockOnUpdate).toBeCalled();
        expect(mockSetUpdateStatus).toBeCalled();
        expect(titleInput.value).toEqual("");
        expect(descriptionInput.value).toEqual("");

    });
});
