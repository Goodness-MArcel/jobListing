export const text = async (req, res) => {
    const message = "Welcome to Job Listing API";
    res.status(200).json({ message });
}