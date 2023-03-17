import ipfshttpclient
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.backends import default_backend

ipfs = ipfshttpclient.connect()


def decrypt():
    with open("./data/kdm.txt", "rb") as _kdm:
        kdm = _kdm.read()
    with open("./data/private_key.pem", "rb") as _private_key:
        private_key = serialization.load_pem_private_key(_private_key.read(), password=None, backend=default_backend())
    new_kdm = bytes.fromhex(kdm)
    print(new_kdm)

    decrypted_kdm = private_key.decrypt(
        new_kdm,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None,
        ),
    )
    decrypted_kdm = decrypted_kdm.decode("utf-8")
    result = decrypted_kdm.split("#")
    decryption_key = result[0]
    starting_time = result[1]
    ending_time = result[2]
    # Open video_encrypted.mp4 with decryption_key
    with open("./data/video_encrypted.mp4", "rb") as _video:
        video = _video.read()
    f = Fernet(decryption_key)
    res = f.decrypt(video)
    with open("./data/video_decrypted.mp4", "wb") as _video:
        _video.write(res)


decrypt()
