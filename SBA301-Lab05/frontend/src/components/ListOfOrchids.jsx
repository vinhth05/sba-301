import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrchids, deleteOrchid } from "../services/orchidApi";

export default function ListOfOrchids() {
  const [orchids, setOrchids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await getOrchids();
      setOrchids(response.data);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this orchid?")) return;
    try {
      await deleteOrchid(id);
      await loadData();
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Orchids</h2>
        <Link className="btn btn-primary" to="/orchids/new">
          Create Orchid
        </Link>
      </div>
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Natural</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orchids.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No orchids found.</td>
            </tr>
          ) : (
            orchids.map((o) => {
              const id = o.orchidId ?? o.id;
              const isNat = o.natural ?? o.isNatural;
              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{o.orchidName}</td>
                  <td>{o.orchidCategory}</td>
                  <td>{isNat ? "Yes" : "No"}</td>
                  <td>
                    <Link
                      className="btn btn-sm btn-warning me-2"
                      to={`/orchids/${id}/edit`}
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
