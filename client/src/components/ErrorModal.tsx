type ErrorModalProps = {
  message: string | null
  onClose: () => void
}

function ErrorModal({ message, onClose }: ErrorModalProps) {
  if (!message) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-2">Ups, algo salió mal</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          className="bg-[#e9b872] px-4 py-2 rounded-md border-3 cursor-pointer"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}

export default ErrorModal
