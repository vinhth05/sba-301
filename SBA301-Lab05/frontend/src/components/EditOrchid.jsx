import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createOrchid, getOrchid, updateOrchid } from "../services/orchidApi";

const emptyForm = {
  orchidName: "",
  natural: false,
  orchidDescription: "",
  orchidCategory: "",
  attractive: false,
  orchidURL: ""
};

export default function EditOrchid({ createMode = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!createMode && id) {
      getOrchid(id)
        .then((r) => {
          const data = r.data;
          setForm({
            orchidName: data.orchidName || "",
            natural: data.natural ?? data.isNatural ?? false,
            orchidDescription: data.orchidDescription || "",
            orchidCategory: data.orchidCategory || "",
            attractive: data.attractive ?? data.isAttractive ?? false,
            orchidURL: data.orchidURL || ""
          });
        })
        .catch((e) => setError(e.message));
    }
  }, [createMode, id]);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (createMode) {
        await createOrchid(form);
      } else {
        await updateOrchid(id, form);
      }
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "600px" }}>
      <form onSubmit={submit}>
        <h2 className="mb-3">{createMode ? "Create Orchid" : "Edit Orchid"}</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            name="orchidName"
            value={form.orchidName ?? ""}
            onChange={change}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            className="form-control"
            name="orchidCategory"
            value={form.orchidCategory ?? ""}
            onChange={change}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="3"
            name="orchidDescription"
            value={form.orchidDescription ?? ""}
            onChange={change}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            className="form-control"
            name="orchidURL"
            value={form.orchidURL ?? ""}
            onChange={change}
          />
        </div>

        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="natural"
            name="natural"
            checked={!!form.natural}
            onChange={change}
          />
          <label className="form-check-label" htmlFor="natural">
            Natural
          </label>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="attractive"
            name="attractive"
            checked={!!form.attractive}
            onChange={change}
          />
          <label className="form-check-label" htmlFor="attractive">
            Attractive
          </label>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-success" type="submit">
            Save
          </button>
          <Link className="btn btn-secondary" to="/">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
