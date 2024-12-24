export default function CreateCourse() {
  return (
    <div>
      <h1>Create Course</h1>
      <form>
        <div>
          <label htmlFor="courseName">Course Name:</label>
          <input type="text" id="courseName" name="courseName" required />
        </div>
        <div>
          <label htmlFor="courseDescription">Course Description:</label>
          <textarea
            id="courseDescription"
            name="courseDescription"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="timeInSeconds">Course Duration (seconds):</label>
          <input
            type="number"
            id="timeInSeconds"
            name="timeInSeconds"
            required
          />
        </div>
        <button type="submit">Create Course</button>
      </form>
    </div>
  );
}
